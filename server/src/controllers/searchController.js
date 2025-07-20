const searchService = require('../services/searchService');

exports.searchLectures = async (req, res) => {
  const { q, page = 1 } = req.query;
  const size = 15;

  // 검색어 필수 검증
  if (!q || q.trim().length === 0) {
    return res.status(400).json({
      code: 'EMPTY_QUERY',
      message: '검색어를 입력해주세요.',
    });
  }

  // 너무 짧은 검색어 제한
  if (q.trim().length < 2) {
    return res.status(401).json({
      code: 'QUERY_TOO_SHORT',
      message: '검색어는 두 글자 이상 입력해주세요.',
    });
  }

  const pageNumber = parseInt(page);

  try {
    const { lectures, total, matched_instructors } =
      await searchService.searchLecturesWithPagination(q.trim(), pageNumber, size);

    const totalPages = Math.ceil(total / size);

    return res.json({
      page: pageNumber,
      totalPages,
      total,
      lectures,
      matched_instructors,
    });
  } catch (err) {
    console.error('검색 오류:', err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
