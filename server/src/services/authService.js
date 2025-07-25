const db = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const redis = require('../db/redisClient');
const validator = require('validator');
const mailService = require('./mailService');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

const CODE_TTL_MIN = 10;
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// 인증 코드 발송
exports.sendCode = async (email) => {
  if (!validator.isEmail(email)) {
    throw { status: 400, message: '이메일 형식이 올바르지 않습니다.' };
  } // 이메일 검증 방식 변경

  // 중복 발송 방지
  const { rowCount } = await db.query(`SELECT 1 FROM users WHERE email = $1`, [email]);
  if (rowCount > 0) {
    throw { status: 409, message: '이미 가입된 이메일입니다.' };
  }

  // 숫자 + 영문 6자리
  const code = [...Array(6)]
    .map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36)))
    .join('');

  await db.query(
    `
    INSERT INTO email_verification_codes (email, code, verified)
    VALUES ($1, $2, FALSE)
    ON CONFLICT (email)
         DO UPDATE SET code = EXCLUDED.code,
                       verified = FALSE,
                       created_at = CURRENT_TIMESTAMP
  `,
    [email, code]
  );

  await mailService.sendVerificationEmail(email, code);
};

// 이메일 코드 검증
exports.verifyCode = async (email, inputCode) => {
  const { rows } = await db.query(
    `SELECT code, created_at FROM email_verification_codes
    WHERE email = $1`,
    [email]
  );

  if (!rows.length) throw { status: 400, message: '인증코드를 먼저 발급받아 주세요.' };

  const { code, created_at } = rows[0];
  const ageMin = (Date.now() - new Date(created_at)) / 60000;

  if (ageMin > CODE_TTL_MIN) throw { status: 400, message: '인증코드가 만료되었습니다.' };

  if (inputCode.length !== code.length) {
    throw { status: 400, message: '인증코드가 일치하지 않습니다.' };
  }
  const isMatch = crypto.timingSafeEqual(Buffer.from(inputCode), Buffer.from(code));
  if (!isMatch) {
    throw { status: 400, message: '인증코드가 일치하지 않습니다.' };
  } // 보안 강화

  // 검증 통과
  await db.query(
    `UPDATE email_verification_codes SET verified = TRUE
    WHERE email = $1`,
    [email]
  );
};

// 최종 회원가입
exports.signup = async ({ email, password, name, nickname, role }) => {
  // 필드 체크
  if (!email || !password || !name || !nickname || !role)
    throw { status: 400, message: '필수 항목이 누락되었습니다.' };

  if (!['instructor', 'student'].includes(role))
    throw { status: 400, message: 'role은 instructor 또는 student여야 합니다.' };

  const client = await db.pool.connect(); // 트랜잭션 시작을 위한 커넥션 확보

  try {
    await client.query('BEGIN');

    // 이메일 검증 여부 확인
    const verifiedRow = await client.query(
      `SELECT verified FROM email_verification_codes
       WHERE email = $1 AND verified = TRUE`,
      [email]
    );

    if (!verifiedRow.rowCount) throw { status: 400, message: '이메일 인증이 완료되지 않았습니다.' };

    // 중복 검사
    const dupEmail = await client.query(`SELECT 1 FROM users WHERE email = $1`, [email]);
    if (dupEmail.rowCount) throw { status: 409, message: '이미 가입된 이메일입니다.' };

    const dupNickname = await client.query(`SELECT 1 FROM users WHERE nickname = $1`, [nickname]);
    if (dupNickname.rowCount) throw { status: 409, message: '이미 사용 중인 닉네임입니다.' };

    // 삽입
    const hashed = await bcrypt.hash(password, 10);
    await client.query(
      `INSERT INTO users (email, password, name, nickname, role, is_verified)
       VALUES ($1, $2, $3, $4, $5, TRUE)`,
      [email, hashed, name, nickname, role]
    );

    // 인증 기록 제거
    await client.query(`DELETE FROM email_verification_codes WHERE email = $1`, [email]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('회원가입 중 오류 발생:', e);
    throw e;
  } finally {
    client.release();
  }
};

// Google OAuth 로그인 또는 회원가입
exports.handleGoogleOAuth = async (code) => {
  // access_token 얻기
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // 사용자 정보 얻기
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();
  const { email, id: oauthId, name, picture } = data;

  // DB 조회: 기존 유저 여부
  const result = await db.query(
    `
    SELECT * FROM users WHERE oauth_provider = 'google' AND oauth_id = $1
  `,
    [oauthId]
  );

  // 기존 유저면 → 로그인 처리
  if (result.rowCount > 0) {
    const user = result.rows[0];
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        public_id: user.public_id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        role: user.role,
        profile_image: user.profile_image,
      },
      profileComplete: !!(user.nickname && user.role),
    };
  }

  // 신규 유저면 Redis에 정보 저장하고 UUID 기반 tempToken 발급
  const uuid = crypto.randomUUID();
  const tempUser = { email, oauthId, name, profile_image: picture };

  await redis.set(`temp-oauth:${uuid}`, JSON.stringify(tempUser), {
    EX: 900, // 15분 TTL
  });

  const tempToken = jwt.sign({ key: uuid }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  return {
    needsSignup: true,
    oauthUser: {
      email,
      name,
      profile_image: picture,
    },
    tempToken,
  };
};

// Google OAuth 최종 회원가입
exports.finalizeGoogleUser = async ({ tempToken, nickname, role }) => {
  // 토큰 디코딩
  const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
  const { key } = decoded;

  // Redis에서 임시 정보 조회
  const raw = await redis.get(`temp-oauth:${key}`);
  if (!raw) {
    throw { status: 400, message: '임시 회원가입 정보가 만료되었거나 없습니다.' };
  }

  let email, oauthId, name, profile_image;
  try {
    const userData = JSON.parse(raw);
    email = userData.email;
    oauthId = userData.oauthId;
    name = userData.name;
    profile_image = userData.profile_image;
  } catch (e) {
    console.error('authService 오류:', e);
    throw { status: 400, message: '임시 정보 파싱 오류' };
  }

  if (!email || !oauthId || !name) {
    throw { status: 400, message: '임시 정보가 불완전합니다. 다시 시도해 주세요.' };
  }

  // 필드 유효성 검사
  if (!['instructor', 'student'].includes(role)) {
    throw { status: 400, message: 'role은 instructor 또는 student여야 합니다.' };
  }

  const client = await db.pool.connect(); // 트랜잭션을 위한 커넥션 확보

  try {
    await client.query('BEGIN');

    const dupNickname = await client.query(`SELECT 1 FROM users WHERE nickname = $1`, [nickname]);
    if (dupNickname.rowCount > 0) {
      throw { status: 409, message: '이미 사용 중인 닉네임입니다.' };
    }

    // 삽입
    const result = await client.query(
      `INSERT INTO users (email, name, nickname, role, profile_image, oauth_provider, oauth_id, is_verified)
       VALUES ($1, $2, $3, $4, $5, 'google', $6, TRUE)
       RETURNING id, public_id`,
      [email, name, nickname, role, profile_image, oauthId]
    );

    await client.query('COMMIT');
    const user = result.rows[0];

    // Redis에서 임시 정보 삭제
    await redis.del(`temp-oauth:${key}`);

    // JWT 발급
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        public_id: user.public_id,
        email,
        name,
        nickname,
        role,
        profile_image,
      },
      profileComplete: true,
    };
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Google 최종 회원가입 트랜잭션 오류:', e);
    throw e;
  } finally {
    client.release();
  }
};

// 일반 로그인
exports.login = async (email, password) => {
  const { rows } = await db.query(
    `
    SELECT id, email, password, name, nickname, role, profile_image, public_id
    FROM users
    WHERE email = $1 AND oauth_provider IS NULL
  `,
    [email]
  );

  if (rows.length === 0) {
    throw { status: 401, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    accessToken,
    user: {
      id: user.id,
      public_id: user.public_id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      role: user.role,
      profile_image: user.profile_image,
    },
  };
};
