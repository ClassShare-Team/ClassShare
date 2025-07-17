const db = require('../db');

exports.searchLecturesWithPagination = async (keyword, page, size) => {
  const offset = (page - 1) * size;
  const searchKeyword = `%${keyword}%`;

  const query = `
    SELECT lectures.id, lectures.title, lectures.description, users.nickname AS instructor
    FROM lectures
    JOIN users ON lectures.instructor_id = users.id
    WHERE lectures.title ILIKE $1
       OR lectures.description ILIKE $1
       OR users.nickname ILIKE $1
    ORDER BY lectures.created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM lectures
    JOIN users ON lectures.instructor_id = users.id
    WHERE lectures.title ILIKE $1
       OR lectures.description ILIKE $1
       OR users.nickname ILIKE $1;
  `;

  const [dataResult, countResult] = await Promise.all([
    db.query(query, [searchKeyword, size, offset]),
    db.query(countQuery, [searchKeyword]),
  ]);

  return {
    lectures: dataResult.rows,
    total: parseInt(countResult.rows[0].total),
  };
};
