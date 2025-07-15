const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/email/send-code', authController.sendVerificationCode);
router.post('/email/verify-code', authController.verifyCode);
router.post('/signup', authController.signup);
router.get('/oauth/google/callback', authController.oauthGoogleCallback);
router.post('/oauth/finalize', authController.finalizeGoogleSignup);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
