const db = require('../db');

// 최대 리뷰 길이
const MAX_CONTENT_LEN = 2000;

// 리뷰 생성
// @returns {Promise<object>}  새로 만든 리뷰 행
exports.createReview = async ({ lectureId, userId, rating, content }) => {
  // 강의 존재 확인
  const { rowCount: lecExists } = await db.query('SELECT 1 FROM lectures WHERE id = $1', [
    lectureId,
  ]);
  if (!lecExists) throw new Error('LECTURE_NOT_FOUND');

  // 사용자 존재 확인
  const { rowCount: userExists } = await db.query('SELECT 1 FROM users WHERE id = $1', [userId]);
  if (!userExists) throw new Error('USER_NOT_FOUND');

  // 평점 검증 (1~5)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('RATING_INVALID');
  }

  // 길이 검증
  if (content.trim().length > MAX_CONTENT_LEN) {
    throw new Error('CONTENT_TOO_LONG');
  }

  // 중복 리뷰 확인 (유니크 제약 대비)
  const { rowCount: dup } = await db.query(
    'SELECT 1 FROM reviews WHERE user_id = $1 AND lecture_id = $2',
    [userId, lectureId]
  );
  if (dup) throw new Error('DUPLICATE_REVIEW');

  // 저장 후 반환
  const { rows } = await db.query(
    `INSERT INTO reviews (user_id, lecture_id, rating, content)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id AS "userId", lecture_id AS "lectureId",
               rating, content, created_at AS "createdAt"`,
    [userId, lectureId, rating, content.trim()]
  );
  return rows[0];
};
