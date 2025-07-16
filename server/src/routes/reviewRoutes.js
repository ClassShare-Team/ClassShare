const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.verifyToken, reviewController.create);
router.post('/reviews/:reviewId/comment', authMiddleware, reviewController.replyToReview);

module.exports = router;
