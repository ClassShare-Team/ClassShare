const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

router.get('/:instructorId/student-count', instructorController.getTotalStudentCount); // 수강생 수
router.get('/:instructorId/review-count', instructorController.getTotalReviewCount); // 리뷰 수
router.get('/:instructorId/reviews-with-comments', instructorController.getAllReviewsWithComments); // 리뷰 조회
router.get('/:id/instructor-introduction', instructorController.getInstructorIntroduction); //소개글 조회
router.get('/:instructorId/lectures', instructorController.getLectures); // 강의 목록 조회
router.get(
  '/:instructorId/lectures/paginated',
  instructorController.getLecturesByInstructorPaginated
); // 강의 목록 조회 페이지네이션용

module.exports = router;
