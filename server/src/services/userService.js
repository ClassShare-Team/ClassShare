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
