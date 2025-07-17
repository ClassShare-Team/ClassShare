const searchService = require('../services/searchService');

exports.searchLectures = async (req, res) => {
  const { q, page = 1 } = req.query;
  const size = 15;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({ message: '검색어를 입력해주세요.' });
  }

  const pageNumber = parseInt(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ message: '유효한 page 번호를 입력하세요.' });
  }

  try {
    const { lectures, total } = await searchService.searchLecturesWithPagination(
      q.trim(),
      pageNumber,
      size
    );
    const totalPages = Math.ceil(total / size);

    return res.json({
      page: pageNumber,
      totalPages,
      total,
      lectures,
    });
  } catch (err) {
    console.error('검색 오류:', err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
