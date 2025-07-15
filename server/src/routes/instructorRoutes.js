const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

// GET /instructors/:instructorId/student-count
router.get('/:instructorId/student-count', instructorController.getTotalStudentCount);
router.get('/:instructorId/review-count', instructorController.getTotalReviewCount);

module.exports = router;
