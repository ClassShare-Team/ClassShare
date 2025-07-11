const jwt = require('jsonwebtoken');
const db = require('../db');
const redis = require('../db/redisClient');

exports.verifyToken = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }
  const token = auth.split(' ')[1];

  try {
    // 블랙리스트
    if (await redis.get(`blacklist:${token}`)) {
      return res.status(401).json({ message: '블랙리스트 토큰입니다.' });
    }

    // 토큰 검증
    const { id, exp } = jwt.verify(token, process.env.JWT_SECRET);

    // DB 조회
    const { rows } = await db.query(
      `SELECT id, email, name, nickname, role, profile_image
         FROM users
        WHERE id = $1`,
      [id]
    );
    if (!rows.length) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 객체 주입
    req.user = rows[0];
    req.token = token; // 로그아웃 시 블랙리스트 등록용
    req.user.exp = exp;
    next();
  } catch (err) {
    console.error('[verifyToken] error:', err);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

//alias
exports.authMiddleware = exports.verifyToken;
