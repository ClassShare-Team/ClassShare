const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/followController');

router.patch('/', ctrl.toggle); // 팔로우 / 언팔
router.get('/count', ctrl.countFollowers); // 팔로워 수

module.exports = router;
