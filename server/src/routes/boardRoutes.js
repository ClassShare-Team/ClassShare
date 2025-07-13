const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/posts', boardController.getPosts);
router.post('/posts', authMiddleware, boardController.createPost);

module.exports = router;
