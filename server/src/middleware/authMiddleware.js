const jwt = require('jsonwebtoken');
const redis = require('../db/redisClient');

// 기본 토큰 검증
exports.verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    console.warn('verifyToken: Authorization 헤더 누락 또는 형식 오류');
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (e) {
    console.error('verifyToken: 유효하지 않은 토큰', e);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

// 블랙리스트 포함 인증 미들웨어
exports.authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.warn('authMiddleware: Authorization 헤더 누락');
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  const blacklisted = await redis.get(`blacklist:${token}`);
  if (blacklisted) {
    console.warn('authMiddleware: 블랙리스트 토큰 차단');
    return res.status(401).json({ message: '블랙리스트 토큰입니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    console.error('authMiddleware: 토큰 검증 실패', e);
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
