// ClassShare/server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../middleware/uploadMiddleware'); // 파일 업로드 미들웨어 임포트

// 내 마이페이지 정보 조회
router.get('/me', authMiddleware, userController.getMyPageInfo);

// ✨ 프로필 정보 수정 (닉네임, 전화번호, 프로필 이미지) 라우트 ✨
// 이 라우트의 경로가 '/profile-image'에서 '/me'로 변경되어야 합니다.
// 프론트엔드에서 PATCH /users/me 로 요청을 보내므로, 백엔드 라우트도 이에 맞춰야 404 에러가 발생하지 않습니다.
router.patch(
  '/me', // ⭐ 이 부분을 '/me'로 변경했습니다. ⭐
  authMiddleware,
  uploadProfileImage.single('profile_image'), // 'profile_image' 필드명으로 단일 파일 업로드
  userController.updateMyPageInfo
);

// 알림 설정 변경
router.patch('/notification-settings', authMiddleware, userController.updateNotificationSettings);

// 비밀번호 변경 라우트
router.patch('/me/password', authMiddleware, userController.updatePassword);

// 1:1 문의 등록
router.post('/inquiries', authMiddleware, userController.createInquiry);

// 내가 구독한 강사 보기
router.get('/subscriptions', authMiddleware, userController.getMySubscriptions);

// 내가 쓴 리뷰 조회
router.get('/my-reviews', authMiddleware, userController.getMyReviews);

// 내가 쓴 댓글 전체 조회
router.get('/my-comments', authMiddleware, userController.getMyComments);

// 내가 수강한 강의 조회
router.get('/my-lectures', authMiddleware, userController.getMyLectures);

// 회원 탈퇴 라우트
router.delete('/me', authMiddleware, userController.deleteAccount);

module.exports = router;
