const lectureService = require('../services/lectureService');

/**
 * [POST] /lectures
 *  ├─ 파일 : thumbnail(1), videos[](N)
 *  └─ 본문 : title, description, price, category(쉼표구분), titles[](N)
 */
exports.createLecture = async (req, res, next) => {
  try {
    // 원본 로그
    console.log('[POST /lectures] req.body  ▶', req.body);
    console.log('[POST /lectures] req.files ▶', Object.keys(req.files || {}));

    // 필드 검증
    const titleRaw = (req.body.title ?? '').trim();
    const description = (req.body.description ?? '').trim();
    const priceRaw = req.body.price ?? 0;

    const categoryStr = (req.body.category ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .join(',');

    if (!titleRaw || !categoryStr) {
      console.warn('[POST /lectures] 필수값 누락', { title: titleRaw, category: categoryStr });
      return res.status(400).json({ message: 'title, category는 필수입니다.' });
    }

    const priceNum = Number(priceRaw);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: 'price는 0 이상의 숫자여야 합니다.' });
    }

    // 파일 검증
    const thumbnailFile = req.files?.thumbnail?.[0] ?? null;
    const videoFiles = req.files?.videos || [];

    if (!thumbnailFile?.location) {
      console.warn('[POST /lectures] 썸네일 누락 또는 업로드 실패');
      return res.status(400).json({ message: '썸네일 파일이 필요합니다.' });
    }
    if (videoFiles.length === 0 || videoFiles.some((v) => !v.location)) {
      console.warn('[POST /lectures] 영상 파일 문제');
      return res.status(400).json({ message: '영상 파일을 1개 이상 업로드하세요.' });
    }

    // 영상 목록 배열 정제
    let videoTitles = req.body.titles ?? [];
    if (!Array.isArray(videoTitles)) videoTitles = [videoTitles];
    videoTitles = videoTitles.map((t) => (t ?? '').trim() || 'Untitled');

    if (videoFiles.length !== videoTitles.length) {
      console.warn('[POST /lectures] 영상 수 / 제목 수 불일치', {
        videoCount: videoFiles.length,
        titleCount: videoTitles.length,
      });
      return res.status(400).json({ message: '영상 수와 titles 수가 일치해야 합니다.' });
    }

    // 서비스 호출
    const result = await lectureService.createLecture({
      instructorId: req.user.id,
      title: titleRaw,
      description,
      price: priceNum,
      category: categoryStr,
      thumbnailFile,
      videoFiles,
      videoTitles,
    });

    console.log('[POST /lectures] 강의 생성 완료:', result.lecturePublicId);
    return res.status(201).json(result);
  } catch (err) {
    console.error('[POST /lectures] 예상치 못한 오류:', err);
    if (err?.stack) console.error(err.stack);
    return next(err); // 전역 에러 핸들러로 전달
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
