const userService = require('../services/userService');

// 마이페이지 정보 조회
exports.getMyPageInfo = async (req, res) => {
  try {
    const result = await userService.getMyPageInfo(req.user.id); // authMiddleware 가 req.user 주입
    res.status(200).json(result);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};
