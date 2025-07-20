const followService = require('../services/followService');

// 팔로우 토글
exports.toggle = async (req, res) => {
  const { studentId, instructorId } = req.body;
  if (!studentId || !instructorId)
    return res.status(400).json({ message: 'studentId와 instructorId 필요' });

  try {
    const followed = await followService.toggleFollow(studentId, instructorId);
    return res.json({ followed });          // true=팔로우, false=언팔
  } catch (err) {
    console.error(err);
    const status = err.message === 'ROLE_MISMATCH' ? 403
                 : err.message === 'USER_NOT_FOUND' ? 404 : 400;
    return res.status(status).json({ message: err.message });
  }
};

// 강사의 팔로우 수 조회
exports.countFollowers = async (req, res) => {
  const { instructorId } = req.query;
  if (!instructorId)
    return res.status(400).json({ message: 'instructorId 쿼리 필요' });

  try {
    const count = await followService.countFollowers(instructorId);
    return res.json({ count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
