const commentService = require('../services/commentService');

// 댓글 작성
exports.create = async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id; // 토큰에서 가져옴

  if (!postId || !content?.trim()) {
    return res.status(400).json({ message: 'postId, content 필요' });
  }

  if (content.trim().length > 1000) {
    return res.status(422).json({ message: 'content는 1000자 이하여야 합니다.' });
  }

  try {
    const comment = await commentService.createComment({ postId, userId, content });
    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);

    const statusMap = {
      POST_NOT_FOUND: 404,
      USER_NOT_FOUND: 404,
      CONTENT_TOO_LONG: 422,
    };
    const status = statusMap[err.message] || 500;
    return res.status(status).json({ message: err.message });
  }
};

// 게시글에 달린 댓글 확인
exports.getByPostId = async (req, res) => {
  const { postId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  if (!postId) {
    return res.status(400).json({ message: 'postId 필요' });
  }

  try {
    const { comments, total } = await commentService.getCommentsByPostId({ postId, offset, limit });
    return res.json({
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '댓글 조회 실패' });
  }
};
