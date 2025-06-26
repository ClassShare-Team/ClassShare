const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/me', authMiddleware, userController.getMyPageInfo);
router.patch(
  '/me',
  authMiddleware,
  upload.single('profile_image'),
  userController.updateMyPageInfo
);
router.patch('/notification-settings', authMiddleware, userController.updateNotificationSettings);

module.exports = router;
