const pointService = require('../services/pointService');

exports.purchasePoints = async (req, res) => {
  const userId = req.user.id;
  const { package_id } = req.body;

  //포인트 구매
  if (!package_id) {
    return res.status(400).json({ success: false, message: '패키지 ID가 필요합니다.' });
  }

  try {
    const result = await pointService.purchasePointPackage(userId, package_id);
    return res.status(200).json(result);
  } catch (err) {
    console.error('포인트 충전 오류:', err.message);
    return res.status(500).json({ success: false, message: err.message || '충전에 실패했습니다.' });
  }
};

// 현재 포인트 조회
exports.getMyPoint = async (req, res) => {
  try {
    const point = await pointService.getCurrentPoint(req.user.id);
    res.status(200).json({ success: true, point });
  } catch (err) {
    console.error('포인트 조회 오류:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 포인트 내역 조회
exports.getMyPointHistories = async (req, res) => {
  try {
    const histories = await pointService.getPointHistories(req.user.id);
    res.status(200).json({ success: true, histories });
  } catch (err) {
    console.error('포인트 내역 오류:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
