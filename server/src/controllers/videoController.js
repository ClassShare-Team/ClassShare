const videoService = require('../services/videoService');

// 비디오 url 불러오기
exports.getVideo = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  try {
    const video = await videoService.getVideoByIdIfPurchased(userId, videoId);
    res.json({ video_url: video.video_url });
  } catch (err) {
    if (err.status === 403) {
      return res.status(403).json({ message: '수강권 없음.' });
    }
    if (err.message === '영상 없음') {
      return res.status(404).json({ message: '영상이 존재하지 않습니다.' });
    }
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
};

// 진도 조회
exports.getProgress = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user.id;
  const progress = await videoService.getProgress(userId, videoId);
  res.json(progress);
};

// 진도 저장
exports.saveProgress = async (req, res) => {
  const { videoId } = req.params;
  const { currentSeconds, isCompleted } = req.body;
  const userId = req.user.id;

  await videoService.saveProgress(userId, videoId, currentSeconds, isCompleted);
  res.json({ success: true });
};
