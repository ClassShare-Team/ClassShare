const express = require('express');
const router = express.Router();
const qnaPostController = require('../controllers/qnaPostController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, qnaPostController.createQnaPost); // 작성
router.get('/:lectureId/posts', qnaPostController.getQnaPostsByLecture); // 전체 목록 (글+답변+구매여부)
router.get('/posts/:postId', qnaPostController.getQnaPostById); // 단일 게시글
router.patch('/posts/:postId', authMiddleware, qnaPostController.updateQnaPost); // 수정
router.delete('/posts/:postId', authMiddleware, qnaPostController.deleteQnaPost); // 삭제
router.get('/posts/:postId/comments', qnaPostController.getQnaComments); // 댓글 조회
router.post('/posts/:postId/comments', authMiddleware, qnaPostController.createQnaComment); // 댓글 작성 (강사만)
router.delete('/comments/:commentId', authMiddleware, qnaPostController.deleteQnaComment); // 댓글 삭제

module.exports = router;
