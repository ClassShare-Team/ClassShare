const db = require('../db');

const TABLE = {
  post: { table: 'post_likes', column: 'post_id' },
  comment: { table: 'comment_likes', column: 'comment_id' },
  lecture: { table: 'lecture_likes', column: 'lecture_id' },
  review: { table: 'review_likes', column: 'review_id' },
};

// 좋아요 토글
exports.toggleLike = async (type, targetId, userId) => {
  const cfg = TABLE[type];
  if (!cfg) throw new Error('INVALID_TYPE');

  // 이미 눌렀는지 확인
  const { rows } = await db.query(
    `SELECT id FROM ${cfg.table} WHERE ${cfg.column} = $1 AND user_id = $2`,
    [targetId, userId]
  );

  if (rows.length) {
    await db.query(`DELETE FROM ${cfg.table} WHERE id = $1`, [rows[0].id]);
    return false; // 좋아요 취소
  }

  await db.query(`INSERT INTO ${cfg.table} (user_id, ${cfg.column}) VALUES ($1, $2)`, [
    userId,
    targetId,
  ]);
  return true; // 좋아요 추가
};

// 대상별 좋아요 수
exports.countLikes = async (type, targetId) => {
  const cfg = TABLE[type];
  if (!cfg) throw new Error('INVALID_TYPE');

  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS cnt
       FROM ${cfg.table}
      WHERE ${cfg.column} = $1`,
    [targetId]
  );
  return rows[0].cnt;
};

// 내가 눌렀는지 여부
exports.isLikedByMe = async (type, targetId, userId) => {
  const cfg = TABLE[type];
  if (!cfg) throw new Error('INVALID_TYPE');

  const { rows } = await db.query(
    `SELECT 1
       FROM ${cfg.table}
      WHERE ${cfg.column} = $1 AND user_id = $2`,
    [targetId, userId]
  );
  return rows.length > 0;
};
