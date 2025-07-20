const redis = require('../db/redisClient');
const authService = require('../services/authService');
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
    await authService.signupAndSendCode({ email, password, name, nickname, role });
    return res.status(201).json({
      message: '회원가입이 완료되었으며, 인증코드가 이메일로 발송되었습니다.',
    });
  } catch (e) {
    console.error('[signup error]', e);
    return res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};
// 구글 OAuth 콜백 처리 (로그인 또는 회원가입 분기)
exports.oauthGoogleCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: 'code 파라미터가 없습니다.' });

  try {
    const result = await authService.handleGoogleOAuth(code);
    const qp = encodeURIComponent;

    if (result.needsSignup && result.tempToken) {
      return res.redirect(
        `${process.env.CLIENT_URL}/oauth/finalize?tempToken=${qp(result.tempToken)}`
      );
    }
    return res.redirect(`${process.env.CLIENT_URL}/oauth/finalize?token=${qp(result.accessToken)}`);
  } catch (e) {
    console.error('Google OAuth 실패:', e);
    return res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};
// 구글 OAuth 회원가입 최종 정보 입력 처리
exports.finalizeGoogleSignup = async (req, res) => {
  const { nickname, role } = req.body;
  const tempToken =
    req.headers.authorization?.split(' ')[1] || req.body.tempToken || req.query.tempToken;

  if (!tempToken) {
    return res.status(401).json({ message: 'tempToken이 필요합니다.' });
  }
  try {
    const result = await authService.finalizeGoogleUser({ nickname, role, tempToken });
    return res.status(201).json(result);
  } catch (e) {
    console.error('구글 회원가입 실패:', e);
    return res
      .status(e.status || 500)
      .json({ message: e.message || '구글 회원가입 처리 중 오류 발생' });
  }
};
// 일반 로그인 요청
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
  }
  try {
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || '로그인 실패' });
  }
};
// 로그아웃
exports.logout = async (req, res) => {
  try {
    const ttlMs = req.user.exp * 1000 - Date.now(); // 토큰 잔여 TTL
    if (ttlMs > 0) {
      await redis.set(`blacklist:${req.token}`, '1', { PX: ttlMs });
    }
    return res.json({ message: '로그아웃 완료' });
  } catch (err) {
    console.error('[logout] error:', err);
    return res.status(500).json({ message: '로그아웃 처리 중 오류가 발생했습니다.' });
  }
};

//추가
//인증 코드 발송
exports.sendCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: '이메일이 누락되었습니다.' });

  try {
    await authService.sendCode(email);
    return res.status(200).json({ message: '인증코드가 발송되었습니다.' });
  } catch (e) {
    console.error('[sendCode error', e);
    return res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};

//추가
//redirect
exports.redirectToGoogle = (req, res) => {
  const base = 'https://accounts.google.com/o/oauth2/v2/auth';

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  return res.redirect(`${base}?${params.toString()}`);
};
