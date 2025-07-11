const lectureService = require('../services/lectureService');

/**
 * [POST] /lectures
 *  ├─ 파일 : thumbnail(1), videos[](N)
 *  └─ 본문 : title, description, price, category(쉼표구분), titles[](N)
 */
exports.createLecture = async (req, res, next) => {
  try {
    // 필드
    const { title, description, price = 0 } = req.body;

    // category 문자열 → 쉼표 구분, trim, 중복 제거
    const categoryStr = (req.body.category || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .join(',');

    if (!title || !categoryStr) {
      return res.status(400).json({ message: 'title과 category는 필수입니다.' });
    }

    // 파일 수집
    const thumbnailFile = req.files?.thumbnail?.[0] ?? null;
    const videoFiles = req.files?.videos || [];

    if (!thumbnailFile) return res.status(400).json({ message: '썸네일 파일이 필요합니다.' });
    if (videoFiles.length === 0) return res.status(400).json({ message: '강의 영상이 없습니다.' });

    // 제목 배열
    let videoTitles = req.body.titles ?? [];
    if (!Array.isArray(videoTitles)) videoTitles = [videoTitles];
    if (videoFiles.length !== videoTitles.length)
      return res.status(400).json({ message: '영상 수와 titles 수가 일치해야 합니다.' });

    // 서비스 호출
    const result = await lectureService.createLecture({
      instructorId: req.user.id,
      title,
      description,
      price: Number(price) || 0,
      category: categoryStr,
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

// 전체 강의 조회
exports.getAllLectures = async (req, res) => {
  try {
    const lectures = await lectureService.getAllLectures();
    return res.status(200).json(lectures);
  } catch (err) {
    console.error('[GET /lectures] error:', err);
    return res.status(500).json({ message: '강의 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};
