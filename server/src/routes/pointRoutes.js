const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { purchasePoints } = require('../controllers/pointController');

router.post('/purchase', authMiddleware, purchasePoints);

module.exports = router;
