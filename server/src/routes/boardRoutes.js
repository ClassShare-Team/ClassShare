const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/posts', boardController.getPosts);
router.post('/posts', authMiddleware, boardController.createPost);
router.get('/posts/:id', boardController.getPostById);

router.delete('/posts/:id', authMiddleware, boardController.deletePost);
router.patch('/posts/:id', authMiddleware, boardController.updatePost);
router.get('/posts/:id/comments', boardController.getComments);
router.post('/posts/:id/comments', authMiddleware, boardController.createComment);
router.delete('/comments/:id', authMiddleware, boardController.deleteComment);
router.post('/comments/:id/replies', authMiddleware, boardController.createReply);

module.exports = router;
