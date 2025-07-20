const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/email/verify-code', authController.verifyCode);
router.post('/signup', authController.signup);
router.get('/oauth/google/callback', authController.oauthGoogleCallback);
router.post('/oauth/finalize', authController.finalizeGoogleSignup);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);

//추가 - GoogleOAuth 로그인
router.get('/oauth/google', authController.redirectToGoogle);
//추가 - 회원가입
router.post('/email/send-code', authController.sendCode);
//추가 - 로그인 상태 확인
router.get('/me', verifyToken, (req, res) => res.json({ user: req.user }));

module.exports = router;
