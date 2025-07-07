const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/likesController');

router.patch('/', likesCtrl.toggle);
router.get('/count', likesCtrl.count);

module.exports = router;
