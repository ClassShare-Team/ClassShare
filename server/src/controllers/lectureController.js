const lectureService = require('../services/lectureService');

/**
 * [POST] /lectures
 *  ├─ 파일 : thumbnail(1), videos[](N)
 *  └─ 본문 : title, description, price, category, titles[](N)
 */
exports.createLecture = async (req, res, next) => {
  try {
    /* 0) 필수 필드 */
    const { title, description, price = 0, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: 'title과 category는 필수입니다.' });
    }

    /* 1) 파일 수집 */
    const thumbnailFile = req.files?.thumbnail?.[0] ?? null;
    const videoFiles = req.files?.videos || [];

    if (!thumbnailFile) return res.status(400).json({ message: '썸네일 파일이 필요합니다.' });
    if (videoFiles.length === 0) return res.status(400).json({ message: '강의 영상이 없습니다.' });

    /* 2) 제목 배열 normalize (1개일 때도 대응) */
    let videoTitles = req.body.titles ?? [];
    if (!Array.isArray(videoTitles)) videoTitles = [videoTitles];
    if (videoFiles.length !== videoTitles.length)
      return res.status(400).json({ message: '영상 수와 titles 수가 일치해야 합니다.' });

    /* 3) 서비스 호출 */
    const result = await lectureService.createLecture({
      instructorId: req.user.id,
      title,
      description,
      price: Number(price) || 0,
      category,
      thumbnailFile,
      videoFiles,
      videoTitles,
    });
    res.status(201).json(result);
  } catch (e) {
    console.error('[POST /lectures] error:', e);
    next(e);
  }
};
