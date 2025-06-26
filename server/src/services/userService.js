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
    [userId],
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
    [userId],
  );

  return { ...user, subscriptions };
};
