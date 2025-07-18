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

// 특정 강사 소개글 조회
exports.getInstructorIntroduction = async (req, res) => {
  const { id } = req.params;
  const introduction = await instructorService.getInstructorIntroduction(id);
  if (!introduction) return res.status(404).json({ message: '강사 프로필 없음' });
  res.json({ introduction });
};

// 특정 강사의 전체 강의 목록 조회
exports.getLectures = async (req, res) => {
  const { instructorId } = req.params;

  try {
    const lectures = await instructorService.getLecturesByInstructor(instructorId);
    return res.json({ lectures });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch lectures.' });
  }
};

// 특정 강사 전체 강의 목록 조회 페이지네이션용
exports.getLecturesByInstructorPaginated = async (req, res) => {
  const { instructorId } = req.params;
  const page = parseInt(req.query.page || '1');
  const size = parseInt(req.query.size || '5');
  const offset = (page - 1) * size;

  try {
    const lectures = await instructorService.getLecturesByInstructorPaginated(
      instructorId,
      size,
      offset
    );
    const total = await instructorService.getTotalLectureCountByInstructor(instructorId);
    const hasNextPage = offset + lectures.length < total;

    res.json({ lectures, total, hasNextPage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
};

// 특정 강사 전체 리뷰 목록 조회 페이지네이션용
exports.getReviewsPaginated = async (req, res) => {
  const { instructorId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 5;
  const offset = (page - 1) * size;

  try {
    const reviews = await instructorService.getReviewsPaginated(instructorId, size, offset);
    const total = await instructorService.getTotalReviewCount(instructorId);
    const hasNextPage = offset + reviews.length < total;
    res.json({ reviews, total, hasNextPage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
};

// 강사 프로필이랑 닉네임
exports.getInstructorSimpleInfo = async (req, res) => {
  const { instructorId } = req.params;
  const data = await instructorService.getInstructorSimpleInfo(instructorId);
  if (!data) return res.status(404).json({ message: '강사 없음' });
  res.json(data);
};
