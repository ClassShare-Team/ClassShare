const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/followController');

router.patch('/', ctrl.toggle);
router.get('/count', ctrl.countFollowers); 

module.exports = router;
