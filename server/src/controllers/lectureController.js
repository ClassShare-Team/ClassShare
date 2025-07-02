const lectureService = require('../services/lectureService');

// 강의 + 영상 목록 생성
exports.createLecture = async (req, res) => {
  // 필수 필드 확인
  const { title, description, price, category, thumbnail } = req.body;
  if (!title || !category) {
    return res.status(400).json({ message: 'title과 category는 필수입니다.' });
  }

  // lectures 메타데이터(JSON 파싱)
  let lecturesMeta;
  try {
    lecturesMeta = JSON.parse(req.body.lectures || '[]');
  } catch (e) {
    return res.status(401).json({ message: 'lectures 필드는 JSON 배열이어야 합니다.' });
  }
  if (!Array.isArray(lecturesMeta) || lecturesMeta.length === 0) {
    return res.status(402).json({ message: 'lectures 배열이 비어 있거나 잘못됐습니다.' });
  }

  // 업로드된 파일 목록
  const files = req.files || [];
  if (files.length !== lecturesMeta.length) {
    return res.status(403).json({ message: '영상 파일 수와 lectures 메타 수가 일치해야 합니다.' });
  }

  try {
    const payload = {
      instructorId: req.user.id,
      title,
      description,
      price: Number(price) || 0,
      category,
      thumbnail,
      lecturesMeta,
      files,
    };

    const result = await lectureService.createLecture(payload);
    return res.status(201).json(result); // 201 Created
  } catch (err) {
    console.error('[POST /lectures] error:', err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
