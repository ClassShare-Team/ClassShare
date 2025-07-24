const pointService = require('../services/pointService');

exports.purchasePoints = async (req, res) => {
  const userId = req.user.id;
  const { package_id } = req.body;

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
