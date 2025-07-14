const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, ctrl.create);
router.get('/', ctrl.getByPostId);


module.exports = router;
