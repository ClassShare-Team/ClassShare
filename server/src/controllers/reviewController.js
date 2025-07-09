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
