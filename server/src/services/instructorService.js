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

// 특정 강사 리뷰 전체 보기
exports.getAllReviewsWithComments = async (instructorId) => {
  const result = await db.query(`
    SELECT
      r.*,
      u.nickname AS student_nickname,
      l.title AS lecture_title,
      COUNT(rl.id) AS like_count,
      rc.content AS instructor_comment,
      rc.created_at AS instructor_commented_at,
      iu.nickname AS instructor_nickname
    FROM reviews r
    JOIN lectures l ON r.lecture_id = l.id
    JOIN users u ON r.user_id = u.id
    LEFT JOIN review_likes rl ON r.id = rl.review_id
    LEFT JOIN review_comments rc ON rc.review_id = r.id
    LEFT JOIN users iu ON rc.user_id = iu.id
    WHERE l.instructor_id = $1
    GROUP BY r.id, u.nickname, l.title, rc.content, rc.created_at, iu.nickname
    ORDER BY r.created_at DESC;
  `, [instructorId]);

  return result.rows;
};
