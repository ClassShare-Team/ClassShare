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

// 리뷰 답변 존재 여부 체크
exports.getReviewCommentByReview = async (reviewId) => {
  const result = await db.query(`SELECT id FROM review_comments WHERE review_id = $1`, [reviewId]);
  return result.rows[0] || null;
};

// 리뷰 답변 생성 또는 수정
exports.upsertReviewComment = async ({ reviewId, userId, content }) => {
  const existing = await exports.getReviewCommentByReview(reviewId);

  if (existing) {
    await db.query(
      `
      UPDATE review_comments SET content = $1, created_at = NOW()
      WHERE review_id = $2
    `,
      [content, reviewId]
    );
  } else {
    await db.query(
      `
      INSERT INTO review_comments (review_id, user_id, content)
      VALUES ($1, $2, $3)
    `,
      [reviewId, userId, content]
    );
  }
};
