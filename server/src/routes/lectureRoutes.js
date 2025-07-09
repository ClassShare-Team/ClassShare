const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { instructorOnly } = require('../middleware/roleMiddleware');
const { uploadVideos } = require('../middleware/uploadMiddleware');

router.post(
  '/',
  authMiddleware,
  instructorOnly,
  uploadVideos.array('videos'),
  lectureController.createLecture
);

module.exports = router;
