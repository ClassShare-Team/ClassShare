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
);

router.get('/', lectureController.getAllLectures);

module.exports = router;
