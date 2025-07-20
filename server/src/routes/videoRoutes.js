const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/:videoId', authMiddleware, videoController.getVideo); // 영상 url 불러오기
router.get('/:videoId/progress', authMiddleware, videoController.getProgress); // 진도 조회
router.post('/:videoId/progress', authMiddleware, videoController.saveProgress); // 진도 저장

module.exports = router;
