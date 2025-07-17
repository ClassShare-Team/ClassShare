const db = require('../db');

exports.searchLecturesWithPagination = async (keyword, page, size) => {
  const offset = (page - 1) * size;
  const searchKeyword = `%${keyword}%`;

  // 1. 강사 닉네임 매칭 조회
  const instructorQuery = `
    SELECT id, nickname, profile_image
    FROM users
    WHERE nickname ILIKE $1
      AND role = 'instructor'
    LIMIT 1;
  `;
  const instructorResult = await db.query(instructorQuery, [searchKeyword]);
  const matchedInstructor = instructorResult.rows.length > 0 ? instructorResult.rows[0] : null;

  // 2. 해당 강사가 올린 강의들 조회
  let instructorLectures = [];
  if (matchedInstructor) {
    const instructorLecturesQuery = `
    SELECT lectures.id,
           lectures.title,
           lectures.description,
           lectures.thumbnail,
           lectures.price,
           lectures.category,
           users.nickname AS instructor
    FROM lectures
    JOIN users ON lectures.instructor_id = users.id
    WHERE lectures.instructor_id = $1
    ORDER BY lectures.created_at DESC;
  `;
    const instructorLecturesResult = await db.query(instructorLecturesQuery, [
      matchedInstructor.id,
    ]);
    instructorLectures = instructorLecturesResult.rows;
  }

  // 3. 강의 제목/소개 매칭 강의 조회
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
    matched_instructor: matchedInstructor
      ? {
          ...matchedInstructor,
          lectures: instructorLectures,
        }
      : null,
  };
};
