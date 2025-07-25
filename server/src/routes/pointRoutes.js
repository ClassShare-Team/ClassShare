const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const pointController = require('../controllers/pointController');

router.post('/purchase', authMiddleware, pointController.purchasePoints); // 포인트 충전
router.get('/my', authMiddleware, pointController.getMyPoint); // 현재 포인트 조회
router.get('/histories', authMiddleware, pointController.getMyPointHistories); // 포인트 내역 조회
router.get('/packages', pointController.getPointPackages); // 패키지 내역 조회

module.exports = router;
