const jwt = require('jsonwebtoken');
const redis = require('../db/redisClient');
const authService = require('../services/authService');

// 이메일 인증코드 발송
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: '이메일이 누락되었습니다.' });
  }

  try {
    await authService.sendCode(email);
    return res.status(200).json({ message: '인증코드가 발송되었습니다.' });
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};

// 인증코드 검증
exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: '이메일 또는 코드가 누락되었습니다.' });
  }

  try {
    await authService.verifyCode(email, code);
    return res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};

// 일반 회원가입 요청 처리
exports.signup = async (req, res) => {
  const { email, password, name, nickname, role } = req.body;

  if (!email || !password || !name || !nickname || !role) {
    return res.status(400).json({ message: '필수 항목이 누락되었습니다.' });
  }

  try {
    await authService.signup({ email, password, name, nickname, role });
    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};

// 구글 OAuth 콜백 처리 (로그인 또는 회원가입 분기)
exports.oauthGoogleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'code 파라미터가 없습니다.' });
  }

  try {
    const result = await authService.handleGoogleOAuth(code);
    res.status(200).json(result);
  } catch (e) {
    console.error('Google OAuth 실패:', e);
    res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};

// 구글 OAuth 회원가입 최종 정보 입력 처리
exports.finalizeGoogleSignup = async (req, res) => {
  const { nickname, role } = req.body;
  const tempToken = req.headers.authorization?.split(' ')[1];

  if (!tempToken) {
    return res.status(401).json({ message: 'tempToken이 필요합니다.' });
  }

  try {
    // tempToken 디코딩
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const { email, oauthId, name, profile_image } = decoded;

    // 서비스 호출
    const result = await authService.finalizeGoogleUser({
      email,
      oauthId,
      name,
      profile_image,
      nickname,
      role,
    });

    return res.status(201).json(result);
  } catch (e) {
    console.error('구글 회원가입 실패:', e);
    res.status(e.status || 500).json({ message: e.message || '구글 회원가입 처리 중 오류 발생' });
  }
};

// 일반 로그인 요청
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });

  try {
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || '로그인 실패' });
  }
};

// 로그아웃
exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ message: '토큰이 없습니다.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;

    if (ttl > 0) {
      await redis.set(`blacklist:${token}`, 1, 'EX', ttl);
    }

    res.status(200).json({ message: '로그아웃이 완료되었습니다.' });
  } catch (e) {
    console.error('로그아웃 시 JWT 오류:', e);
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
