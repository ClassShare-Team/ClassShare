const likesService = require('../services/likesService');

const VALID_TYPES = ['post', 'comment', 'lecture', 'review'];

function validateInputs(type, targetId, userIdRequired = false, userId) {
  if (!VALID_TYPES.includes(type)) throw new Error('INVALID_TYPE');
  if (!targetId) throw new Error('TARGET_ID_REQUIRED');
  if (userIdRequired && !userId) throw new Error('USER_ID_REQUIRED');
}

// 좋아요 토글
exports.toggle = async (req, res) => {
  const { type, targetId, userId } = req.body;

  try {
    validateInputs(type, targetId, true, userId);
    const liked = await likesService.toggleLike(type, targetId, userId);
    return res.json({ liked });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
};

// 좋아요 개수
exports.count = async (req, res) => {
  const { type, targetId } = req.query;

  try {
    validateInputs(type, targetId);
    const count = await likesService.countLikes(type, targetId);
    return res.json({ count });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
};
