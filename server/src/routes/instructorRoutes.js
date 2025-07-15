const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

router.get('/:instructorId/student-count', instructorController.getTotalStudentCount); // 수강생 수
router.get('/:instructorId/review-count', instructorController.getTotalReviewCount); // 리뷰 수
router.get('/:instructorId/reviews-with-comments', instructorController.getAllReviewsWithComments); // 리뷰 조회

module.exports = router;
