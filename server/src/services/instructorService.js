const db = require('../db');

// 특정 강사의 전체 수강생 수
exports.getTotalStudentCountByInstructor = async (instructorId) => {
  const result = await db.query(
    `
    SELECT COUNT(lp.id) AS total_student_count
    FROM lectures l
    LEFT JOIN lecture_purchases lp ON l.id = lp.lecture_id
    WHERE l.instructor_id = $1
  `,
    [instructorId]
  );

  return result.rows[0];
};

// 특정 강사의 전체 리뷰 수
exports.getTotalReviewCountByInstructor = async (instructorId) => {
  const result = await db.query(`
    SELECT COUNT(r.id) AS total_review_count
    FROM lectures l
    LEFT JOIN reviews r ON l.id = r.lecture_id
    WHERE l.instructor_id = $1
  `, [instructorId]);

  return result.rows[0];
};
