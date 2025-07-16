const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../middleware/uploadMiddleware');

router.get('/me', authMiddleware, userController.getMyPageInfo);
router.patch(
  '/profile-image',
  authMiddleware,
  uploadProfileImage.single('profile_image'),
  userController.updateMyPageInfo
);
router.patch('/notification-settings', authMiddleware, userController.updateNotificationSettings);
router.patch('/me/password', authMiddleware, userController.updatePassword);
router.post('/inquiries', authMiddleware, userController.createInquiry);
router.get('/subscriptions', authMiddleware, userController.getMySubscriptions);
router.get('/my-reviews', authMiddleware, userController.getMyReviews);
router.get('/my-comments', authMiddleware, userController.getMyComments);
router.get('/my-lectures', authMiddleware, userController.getMyLectures);
router.patch(
  '/instructor-introduction',
  authMiddleware,
  userController.updateInstructorIntroduction
);

module.exports = router;
