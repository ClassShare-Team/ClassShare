const qnaPostService = require('../services/qnaPostService');

// Q&A 포스트 올리기
exports.createQnaPost = async (req, res) => {
  const { lecture_id, title, content } = req.body;
  const user_id = req.user.id;

  if (!lecture_id || !title || !content) {
    return res.status(400).json({ message: '필수 항목 누락' });
  }

  try {
    const post = await qnaPostService.createQnaPost({ user_id, lecture_id, title, content });
    return res.status(201).json({ message: 'Q&A 작성 완료', postId: post.id });
  } catch (error) {
    console.error(error.message);
    if (error.message.includes('강의가 존재하지 않습니다')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: '서버 에러' });
  }
};

// Q&A 게시글 목록 조회
exports.getQnaPostsByLecture = async (req, res) => {
  const { lectureId } = req.params;
  try {
    const posts = await qnaPostService.getQnaPostsByLecture(lectureId);
    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
};

// Q&A 게시글 상세 조회
exports.getQnaPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await qnaPostService.getQnaPostById(postId);
    if (!post) return res.status(404).json({ message: '게시글이 없습니다.' });
    res.json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
};

// 수정
exports.updateQnaPost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;

  const ownerId = await qnaPostService.getQnaPostOwner(postId);
  if (!ownerId) return res.status(404).json({ message: '게시글 없음' });
  if (ownerId !== userId) return res.status(403).json({ message: '권한 없음' });

  await qnaPostService.updateQnaPost({ postId, title, content });
  res.json({ message: '수정 완료' });
};

// 삭제
exports.deleteQnaPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const ownerId = await qnaPostService.getQnaPostOwner(postId);
  if (!ownerId) return res.status(404).json({ message: '게시글 없음' });
  if (ownerId !== userId) return res.status(403).json({ message: '권한 없음' });

  await qnaPostService.deleteQnaPost(postId);
  res.json({ message: '삭제 완료' });
};

// 댓글 목록
exports.getQnaComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await qnaPostService.getQnaComments(postId);
  res.json({ comments });
};

// 댓글 작성 (강사만)
exports.createQnaComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const post = await db.query(`SELECT category FROM posts WHERE id = $1`, [postId]);
  if (post.rowCount === 0) return res.status(404).json({ message: '게시글 없음' });
  if (post.rows[0].category !== 'qa') return res.status(400).json({ message: 'Q&A 글이 아님' });

  const role = await db.query(`SELECT role FROM users WHERE id = $1`, [userId]);
  if (role.rows[0]?.role !== 'instructor')
    return res.status(403).json({ message: '강사만 작성 가능' });

  await qnaPostService.createQnaComment({ postId, userId, content });
  res.status(201).json({ message: '댓글 작성 완료' });
};

// 댓글 삭제 (본인만)
exports.deleteQnaComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const ownerId = await qnaPostService.getQnaCommentOwner(commentId);
  if (!ownerId) return res.status(404).json({ message: '댓글 없음' });
  if (ownerId !== userId) return res.status(403).json({ message: '본인만 삭제 가능' });

  await qnaPostService.deleteQnaComment(commentId);
  res.json({ message: '삭제 완료' });
};
