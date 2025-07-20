const express = require('express');
const multer = require('multer');
const router = express.Router();

const lectureController = require('../controllers/lectureController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { instructorOnly } = require('../middleware/roleMiddleware');
const { uploadLectureMedia } = require('../middleware/uploadMiddleware');

router.post(
  '/',
  authMiddleware,
  instructorOnly,
  (req, res, next) => {
    uploadLectureMedia(req, res, (err) => {
      if (!err) return next();
      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            return res.status(413).json({ message: '파일이 너무 큽니다.' });
          case 'LIMIT_UNEXPECTED_FILE':
            return res.status(400).json({ message: '예상치 못한 필드명입니다.' });
          default:
            return res.status(400).json({ message: err.message });
        }
      }
      console.error('[uploadLectureMedia] unknown error:', err);
      return res.status(500).json({ message: '파일 업로드 중 오류가 발생했습니다.' });
    });
  },
  lectureController.createLecture
);

router.get('/', lectureController.getAllLectures); // 전체 강의 조회
router.get('/:id', lectureController.getLectureById); // 강의 단건 조회
router.get('/:id/curriculum', authMiddleware, lectureController.getCurriculumByLectureId); // 단건 강의 커리큘럼 조회 (목록 조회)
router.post('/:id/purchase', authMiddleware, lectureController.purchaseLecture); // 강의 무료 구매
router.get('/:lectureId/purchased', authMiddleware, lectureController.checkPurchased); // 구매 여부
router.delete('/:id', authMiddleware, instructorOnly, lectureController.deleteLecture); // 강의 삭제

module.exports = router;
