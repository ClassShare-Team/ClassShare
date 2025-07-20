const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../middleware/uploadMiddleware');

router.get('/me', authMiddleware, userController.getMyPageInfo); // 정보 조회
router.patch(
  '/me',
  authMiddleware,
  uploadProfileImage.single('profile_image'),
  userController.updateMyPageInfo
); // 정보 수정
router.patch('/notification-settings', authMiddleware, userController.updateNotificationSettings); // 알림 설정
router.patch('/me/password', authMiddleware, userController.updatePassword); // 비밀번호 변경
router.post('/inquiries', authMiddleware, userController.createInquiry); // 문의 쓰기
router.get('/subscriptions', authMiddleware, userController.getMySubscriptions); // 나의 구독 조회 (스펙아웃)
router.get('/my-reviews', authMiddleware, userController.getMyReviews); // 나의 리뷰 조회
router.get('/my-comments', authMiddleware, userController.getMyComments); // 나의 댓글 조회
router.get('/my-lectures', authMiddleware, userController.getMyLectures); // 나의 강의 조회
router.patch(
  '/instructor-introduction',
  authMiddleware,
  userController.updateInstructorIntroduction
); // 소개글 작성
router.delete('/me', authMiddleware, userController.deleteMyAccount); // 회원 탈퇴
router.get('/me/students/all', authMiddleware, userController.getMyAllStudents); // 전체 수강자 수 및 목록 조회
router.get('/me/students/by-lecture', authMiddleware, userController.getMyStudentsByLecture); // 특정 강의 수강자 수 및 목록 조회

module.exports = router;
