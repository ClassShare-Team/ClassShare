const commentService = require('../services/commentService');

// 댓글 작성
exports.create = async (req, res) => {
  const { postId, userId, content } = req.body;

  // 필수 값 누락
  if (!postId || !userId || !content?.trim()) {
    return res.status(400).json({ message: 'postId, userId, content 필요' });
  }

  // 콘텐츠 길이 제한(1000자)
  if (content.trim().length > 1000) {
    return res.status(422).json({ message: 'content는 1000자 이하여야 합니다.' });
  }

  try {
    const comment = await commentService.createComment({ postId, userId, content });
    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);

    // HTTP status 매핑
    const statusMap = {
      POST_NOT_FOUND: 404, // 게시글 없음
      USER_NOT_FOUND: 404, // 작성자 없음
      CONTENT_TOO_LONG: 422, // 길이 초과(서비스 계층 검사용)
    };

    const status = statusMap[err.message] || 500; // 매핑 안 되면 500
    return res.status(status).json({ message: err.message });
  }
};
