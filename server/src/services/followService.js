const db = require('../db');

/** 팔로우 토글: 있으면 삭제, 없으면 추가
 *  @returns {Promise<boolean>}  true  = 팔로우 추가
 *                               false = 팔로우 취소
 */
exports.toggleFollow = async (studentId, instructorId) => {
  // 두 유저의 role 확인
  const { rows: roleRows } = await db.query(
    `SELECT id, role FROM users WHERE id = ANY($1::int[])`,
    [[studentId, instructorId]]
  );
  if (roleRows.length !== 2) throw new Error('USER_NOT_FOUND');

  const roles = Object.fromEntries(roleRows.map(r => [r.id, r.role]));
  if (roles[studentId] !== 'student' || roles[instructorId] !== 'instructor') {
    throw new Error('ROLE_MISMATCH');           // 학생이 강사만 팔로우 가능
  }

  // 이미 팔로우했는지?
  const { rows } = await db.query(
    `SELECT id FROM follows WHERE follower_id=$1 AND following_id=$2`,
    [studentId, instructorId]
  );

  if (rows.length) {
    // 취소
    await db.query(`DELETE FROM follows WHERE id=$1`, [rows[0].id]);
    return false;
  }
  // 추가
  await db.query(
    `INSERT INTO follows (follower_id, following_id) VALUES ($1,$2)`,
    [studentId, instructorId]
  );
  return true;
};

// 강사의 팔로워 수
exports.countFollowers = async instructorId => {
  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS cnt FROM follows WHERE following_id = $1`,
    [instructorId]
  );
  return rows[0].cnt;
};
