const db = require('../db');

exports.searchLecturesWithPagination = async (keyword, page, size) => {
  const offset = (page - 1) * size;
  const searchKeyword = `%${keyword}%`;

  // 1. 강사 닉네임 매칭 조회 (전체)
  const instructorQuery = `
    SELECT id, nickname, profile_image
    FROM users
    WHERE nickname ILIKE $1
      AND role = 'instructor';
  `;
  const instructorResult = await db.query(instructorQuery, [searchKeyword]);
  const matchedInstructors = instructorResult.rows;

  // 2. 각 강사의 강의 가져오기
  let instructorsWithLectures = [];
  if (matchedInstructors.length > 0) {
    const instructorIds = matchedInstructors.map(inst => inst.id);

    const instructorLecturesQuery = `
      SELECT lectures.id,
             lectures.title,
             lectures.description,
             lectures.thumbnail,
             lectures.price,
             lectures.category,
             lectures.instructor_id,
             users.nickname AS instructor
      FROM lectures
      JOIN users ON lectures.instructor_id = users.id
      WHERE lectures.instructor_id = ANY($1::int[])
      ORDER BY lectures.created_at DESC;
    `;

    const instructorLecturesResult = await db.query(instructorLecturesQuery, [instructorIds]);

    // 강사별로 그룹화
    instructorsWithLectures = matchedInstructors.map(inst => ({
      ...inst,
      lectures: instructorLecturesResult.rows.filter(lecture => lecture.instructor_id === inst.id)
    }));
  }

  // 3. 일반 강의 검색 (제목, 소개, 카테고리)
  const lecturesQuery = `
    SELECT lectures.id,
           lectures.title,
           lectures.description,
           lectures.thumbnail,
           lectures.price,
           lectures.category,
           users.nickname AS instructor
    FROM lectures
    JOIN users ON lectures.instructor_id = users.id
    WHERE (lectures.title ILIKE $1 OR lectures.description ILIKE $1 OR lectures.category ILIKE $1)
    ORDER BY lectures.created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM lectures
    WHERE title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1;
  `;

  const [lecturesResult, countResult] = await Promise.all([
    db.query(lecturesQuery, [searchKeyword, size, offset]),
    db.query(countQuery, [searchKeyword]),
  ]);

  return {
    lectures: lecturesResult.rows,
    total: parseInt(countResult.rows[0].total),
    matched_instructors: instructorsWithLectures.length > 0 ? instructorsWithLectures : null,
  };
};
