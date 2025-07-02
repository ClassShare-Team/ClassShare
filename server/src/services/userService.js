const db = require('../db');

// 마이페이지 정보 조회
exports.getMyPageInfo = async (userId) => {
  // 기본 프로필
  const {
    rows: [user],
  } = await db.query(
    `SELECT id, email, name, nickname, role, phone, profile_image
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (!user) throw { status: 404, message: '사용자를 찾을 수 없습니다.' };

  // 현재(만료 전) 구독 강사 목록
  const { rows: subscriptions } = await db.query(
    `SELECT
        s.instructor_id        AS "instructorId",
        u.nickname              ,
        TO_CHAR(s.started_at, 'YYYY-MM-DD') AS "subscribed_at"
     FROM subscriptions s
     JOIN users u ON u.id = s.instructor_id
     WHERE s.user_id = $1
       AND s.expired_at   > NOW()          -- 만료되지 않은 구독만
     ORDER BY s.started_at DESC`,
    [userId]
  );

  return { ...user, subscriptions };
};

// 유저가 자신의 마이페이지 정보를 부분 수정
exports.updateMyPageInfo = async (userId, fieldsToUpdate) => {
  const allowedFields = ['nickname', 'phone', 'profile_image'];
  const updates = [];
  const values = [];

  // 닉네임 중복 검사
  if (fieldsToUpdate.nickname !== undefined) {
    const {
      rows: [dup],
    } = await db.query(`SELECT id FROM users WHERE nickname = $1 AND id <> $2`, [
      fieldsToUpdate.nickname,
      userId,
    ]);
    if (dup) {
      throw { status: 409, message: '이미 사용 중인 닉네임입니다.' };
    }
  }

  // 업데이트할 필드 필터링
  allowedFields.forEach((field) => {
    if (fieldsToUpdate[field] !== undefined) {
      values.push(fieldsToUpdate[field]);
      updates.push(`${field} = $${values.length}`);
    }
  });

  if (updates.length === 0) {
    throw { status: 400, message: '수정할 필드가 없습니다.' };
  }

  // UPDATE 실행
  values.push(userId); // 마지막은 userId
  const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${values.length}
  `;

  await db.query(query, values);
};

// 변경 전 기존 프로필 조회
exports.getUserById = async (userId) => {
  const { rows } = await db.query('SELECT id, profile_image FROM users WHERE id = $1', [userId]);
  return rows[0];
};

// 비밀번호까지 포함된 사용자 조회
exports.getUserWithPassword = async (userId) => {
  const { rows } = await db.query('SELECT id, password FROM users WHERE id = $1', [userId]);
  return rows[0];
};

// 비밀번호 업데이트
exports.updateUserPassword = async (userId, hashedPassword) => {
  await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
};

// 1:1 문의 등록
exports.createInquiry = async (userId, title, content) => {
  if (!title || !content) {
    throw { status: 400, code: 'MISSING_FIELD', message: '제목과 내용을 모두 입력해주세요.' };
  }

  const insertSQL = `
    INSERT INTO inquiries (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  const { rows } = await db.query(insertSQL, [userId, title.trim(), content.trim()]);
  return rows[0].id; // 생성된 inquiryId 반환
};

// 내가 구독한 강사 목록 조회
exports.getMySubscriptions = async (userId, page, size) => {
  const offset = (page - 1) * size;

  // 전체 구독 수 조회
  const totalResult = await db.query(
    `SELECT COUNT(*) AS total
     FROM subscriptions
     WHERE user_id = $1`,
    [userId]
  );
  const total = parseInt(totalResult.rows[0].total);

  // 구독 목록 조회 (instructor_profiles 조인)
  const subscriptionsResult = await db.query(
    `SELECT
        u.id AS "instructorId",
        u.nickname,
        u.profile_image,
        ip.subscription_price,
        s.subscribed_at,
        s.subscribed_until,
        s.is_auto_renew
     FROM subscriptions s
     JOIN users u ON s.instructor_id = u.id
     JOIN instructor_profiles ip ON ip.instructor_id = u.id
     WHERE s.user_id = $1
     ORDER BY s.subscribed_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, size, offset]
  );

  return {
    page,
    size,
    total,
    subscriptions: subscriptionsResult.rows,
  };
};

// 내 리뷰 조회
exports.getMyReviews = async (userId, page, size) => {
  const offset = (page - 1) * size;

  // 총 개수
  const {
    rows: [{ total }],
  } = await db.query(
    `SELECT COUNT(*)::INT AS total
       FROM reviews
      WHERE user_id = $1`,
    [userId]
  );

  // 리뷰 목록
  const { rows: reviews } = await db.query(
    `SELECT
        r.id,
        r.lecture_id               AS "lectureId",
        l.title                     AS "lectureTitle",
        r.rating,
        r.content,
        r.created_at
     FROM reviews r
     JOIN lectures l ON l.id = r.lecture_id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3`,
    [userId, size, offset]
  );

  return { page, size, total, reviews };
};

// 내가 쓴 댓글 전체 조회
exports.getMyComments = async (userId, page, size) => {
  const offset = (page - 1) * size;

  // 총 개수
  const {
    rows: [{ total }],
  } = await db.query(
    `SELECT COUNT(*)::INT AS total
       FROM comments
      WHERE user_id = $1`,
    [userId]
  );

  // 댓글 조회
  const { rows: comments } = await db.query(
    `SELECT
        c.id,
        c.post_id            AS "postId",
        p.title              AS "postTitle",
        c.content,
        c.created_at
     FROM comments c
     JOIN posts p ON p.id = c.post_id
    WHERE c.user_id = $1
    ORDER BY c.created_at DESC
    LIMIT $2 OFFSET $3`,
    [userId, size, offset]
  );

  return { page, size, total, comments };
};
