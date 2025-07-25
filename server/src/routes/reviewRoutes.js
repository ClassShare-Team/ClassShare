const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, reviewController.create); // 리뷰 작성
router.post('/:reviewId/comment', authMiddleware, reviewController.replyToReview); // 리뷰 답변 작성
router.get('/lectures/:lectureId', reviewController.getReviewsByLecture); // 강의 리뷰 목록 조회
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview); // 리뷰 삭제

module.exports = router;
