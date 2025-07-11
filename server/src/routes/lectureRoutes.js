const express = require('express');
const router = express.Router();

const lectureController = require('../controllers/lectureController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { instructorOnly } = require('../middleware/roleMiddleware');
const { uploadLectureMedia } = require('../middleware/uploadMiddleware');

router.post(
  '/',
  authMiddleware,
  instructorOnly,
  uploadLectureMedia,
  lectureController.createLecture
); // 강의 생성

router.get('/', lectureController.getAllLectures); // 전체 강의 조회
router.get('/:id', lectureController.getLectureById); // 강의 단건 조회
router.get('/:id/curriculum', lectureController.getCurriculumByLectureId); // 단건 강의 커리큘럼 조회 (목록 조회)
router.post('/:id/purchase', lectureController.purchaseLecture); // 강의 무료 구매

module.exports = router;
