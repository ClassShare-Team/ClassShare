const instructorService = require('../services/instructorService');

// 특정 강사 수강생 수 조회
exports.getTotalStudentCount = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const data = await instructorService.getTotalStudentCountByInstructor(instructorId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
};

// 특정 강사 리뷰 수 조회
exports.getTotalReviewCount = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const data = await instructorService.getTotalReviewCountByInstructor(instructorId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
};

// 특정 강사 리뷰 전체 조회
exports.getAllReviewsWithComments = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const reviews = await instructorService.getAllReviewsWithComments(instructorId);
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
};
