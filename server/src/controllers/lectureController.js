const lectureService = require('../services/lectureService');

/**
 * [POST] /lectures
 *  ├─ 파일 : thumbnail(1), videos[](N)
 *  └─ 본문 : title, description, price, category(쉼표구분), titles[](N)
 */
exports.createLecture = async (req, res, next) => {
  try {
    // 요청 원본 로그
    console.log('[POST /lectures] req.body  ▶', req.body);
    console.log('[POST /lectures] req.files ▶', Object.keys(req.files || {}));

    // 필드
    const { title, description, price = 0 } = req.body;

    // category 문자열 → 쉼표 구분, trim, 중복 제거
    const categoryStr = (req.body.category || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .join(',');

    if (!title || !categoryStr) {
      console.warn('[POST /lectures] 누락된 필수값', { title, categoryStr });
      return res.status(400).json({ message: 'title과 category는 필수입니다.' });
    }

    // 파일 수집
    const thumbnailFile = req.files?.thumbnail?.[0] ?? null;
    const videoFiles = req.files?.videos || [];

    if (!thumbnailFile) {
      console.warn('[POST /lectures] 썸네일 누락');
      return res.status(401).json({ message: '썸네일 파일이 필요합니다.' });
    }
    if (videoFiles.length === 0) {
      console.warn('[POST /lectures] 영상 파일 0개');
      return res.status(402).json({ message: '강의 영상이 없습니다.' });
    }

    // 제목 배열
    let videoTitles = req.body.titles ?? [];
    if (!Array.isArray(videoTitles)) videoTitles = [videoTitles];
    if (videoFiles.length !== videoTitles.length) {
      console.warn('[POST /lectures] 영상 수 / 제목 수 불일치', {
        videoCount: videoFiles.length,
        titleCount: videoTitles.length,
      });
      return res.status(403).json({ message: '영상 수와 titles 수가 일치해야 합니다.' });
    }

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

    console.log('[POST /lectures] 강의 생성 완료:', result?.id ?? result);
    res.status(201).json(result);
  } catch (err) {
    console.error('[POST /lectures] 예상치 못한 오류:', err);
    if (err?.stack) console.error(err.stack);
    next(err);
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

// 강의 단건 조회
exports.getLectureById = async (req, res) => {
  const lectureId = parseInt(req.params.id, 10);
  if (isNaN(lectureId)) {
    return res.status(400).json({ message: '유효한 강의 ID가 아닙니다.' });
  }

  try {
    const lecture = await lectureService.getLectureById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: '해당 강의를 찾을 수 없습니다.' });
    }
    return res.status(200).json(lecture);
  } catch (err) {
    console.error(`[GET /lectures/${lectureId}] error:`, err);
    return res.status(500).json({ message: '강의 정보를 불러오는 중 오류가 발생했습니다.' });
  }
};

// 특정 강의 커리큘럼 조회
exports.getCurriculumByLectureId = async (req, res) => {
  const lectureId = parseInt(req.params.id, 10);
  if (isNaN(lectureId)) {
    return res.status(400).json({ message: '유효한 강의 ID가 아닙니다.' });
  }

  try {
    const curriculum = await lectureService.getCurriculumByLectureId(lectureId);
    return res.status(200).json(curriculum);
  } catch (err) {
    console.error(`[GET /lectures/${lectureId}/curriculum] error:`, err);
    return res.status(500).json({ message: '커리큘럼 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};

// 무료 강의 구매
exports.purchaseLecture = async (req, res) => {
  const lectureId = parseInt(req.params.id, 10);
  const userId = req.user?.id;

  if (isNaN(lectureId) || !userId) {
    return res.status(400).json({ message: '잘못된 요청입니다.' });
  }

  try {
    const result = await lectureService.purchaseLecture(userId, lectureId);
    if (result.alreadyPurchased) {
      return res.status(200).json({ message: '이미 구매한 강의입니다.' });
    }
    return res.status(201).json({ message: '결제가 완료되었습니다. 수강이 가능합니다.' });
  } catch (err) {
    console.error('[POST /lectures/:id/purchase] error:', err);
    return res.status(500).json({ message: '결제 처리 중 오류가 발생했습니다.' });
  }
};
