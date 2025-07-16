const reviewService = require('../services/reviewService');

// 리뷰 작성
exports.create = async (req, res) => {
  const { lectureId, userId, rating, content } = req.body;

  // 400 - 필수 값 누락
  if (!lectureId || !userId || rating === undefined || !content?.trim()) {
    return res.status(400).json({ message: 'lectureId, userId, rating, content 필요' });
  }

  try {
    const review = await reviewService.createReview({ lectureId, userId, rating, content });
    return res.status(201).json(review); // 201 - 정상 생성
  } catch (err) {
    console.error(err);

    // 에러 코드 → HTTP status 매핑
    const statusMap = {
      LECTURE_NOT_FOUND: 404,
      USER_NOT_FOUND: 404,
      RATING_INVALID: 422,
      CONTENT_TOO_LONG: 422,
      DUPLICATE_REVIEW: 409,
    };
    const status = statusMap[err.message] || 500;
    return res.status(status).json({ message: err.message });
  }
};

// 리뷰 답변 작성 (강사만)
exports.replyToReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const role = await db.query(`SELECT role FROM users WHERE id = $1`, [userId]);
  if (role.rows[0]?.role !== 'instructor')
    return res.status(403).json({ message: '강사만 답변 가능' });

  // 리뷰 존재 확인
  const review = await db.query(`SELECT id FROM reviews WHERE id = $1`, [reviewId]);
  if (review.rowCount === 0) return res.status(404).json({ message: '리뷰 없음' });

  await reviewService.upsertReviewComment({ reviewId, userId, content });
  res.status(200).json({ message: '답변 완료' });
};
