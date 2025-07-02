module.exports.instructorOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'instructor') {
    return res.status(403).json({ message: '강사만 실행할 수 있는 기능입니다.' });
  }
  next();
};
