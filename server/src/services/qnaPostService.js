const db = require('../db');

// Q&A 포스트 생성
exports.createQnaPost = async ({ user_id, lecture_id, title, content }) => {
  // 강의 존재 확인
  const lectureResult = await db.query(`SELECT id, instructor_id FROM lectures WHERE id = $1`, [
    lecture_id,
  ]);
  if (lectureResult.rowCount === 0) {
    throw new Error('강의가 존재하지 않습니다.');
  }

  const instructor_id = lectureResult.rows[0].instructor_id;

  const result = await db.query(
    `
    INSERT INTO posts (user_id, category, lecture_id, instructor_id, title, content)
    VALUES ($1, 'qa', $2, $3, $4, $5)
    RETURNING id
  `,
    [user_id, lecture_id, instructor_id, title, content]
  );

  return result.rows[0];
};

// 강의 Q&A 전체 게시글 조회
exports.getQnaPostsByLecture = async (lectureId) => {
  const result = await db.query(
    `
    SELECT id, title, created_at, user_id FROM posts
    WHERE category = 'qa' AND lecture_id = $1
    ORDER BY created_at DESC
  `,
    [lectureId]
  );
  return result.rows;
};

// 단일 Q&A 게시글 조회
exports.getQnaPostById = async (postId) => {
  const result = await db.query(
    `
    SELECT p.id, p.title, p.content, p.created_at, p.user_id, u.nickname AS writer
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1 AND p.category = 'qa'
  `,
    [postId]
  );

  if (result.rowCount === 0) return null;
  return result.rows[0];
};

// 게시글 작성자 확인
exports.getQnaPostOwner = async (postId) => {
  const result = await db.query(
    `
    SELECT user_id FROM posts WHERE id = $1 AND category = 'qa'
  `,
    [postId]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0].user_id;
};

exports.updateQnaPost = async ({ postId, title, content }) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (title !== undefined) {
    fields.push(`title = $${index++}`);
    values.push(title);
  }

  if (content !== undefined) {
    fields.push(`content = $${index++}`);
    values.push(content);
  }

  if (fields.length === 0) throw new Error('수정할 내용 없음');

  values.push(postId);

  const query = `
    UPDATE posts SET ${fields.join(', ')} WHERE id = $${index}
  `;

  await db.query(query, values);
};

// 게시글 삭제
exports.deleteQnaPost = async (postId) => {
  await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);
};

// 댓글 조회
exports.getQnaComments = async (postId) => {
  const result = await db.query(
    `
    SELECT qc.id, qc.content, qc.created_at, u.nickname, u.id AS user_id
    FROM qna_comments qc
    JOIN users u ON qc.user_id = u.id
    WHERE qc.post_id = $1
    ORDER BY qc.created_at ASC
    `,
    [postId]
  );
  return result.rows;
};

// 댓글 작성
exports.createQnaComment = async ({ postId, userId, content }) => {
  await db.query(`INSERT INTO qna_comments (post_id, user_id, content) VALUES ($1, $2, $3)`, [
    postId,
    userId,
    content,
  ]);
};

// 댓글 소유자 조회
exports.getQnaCommentOwner = async (commentId) => {
  const result = await db.query(`SELECT user_id FROM qna_comments WHERE id = $1`, [commentId]);
  return result.rowCount ? result.rows[0].user_id : null;
};
// 댓글 삭제
exports.deleteQnaComment = async (commentId) => {
  await db.query(`DELETE FROM qna_comments WHERE id = $1`, [commentId]);
};

//qna 전체 조회
exports.getQnaPostsWithCommentsByLecture = async (lectureId) => {
  // Q&A 게시글 목록 조회 (user_id 포함)
  const { rows: posts } = await db.query(
    `
    SELECT
      p.id, p.title, p.content, p.created_at,
      p.user_id, u.nickname,
      EXISTS (
        SELECT 1 FROM lecture_purchases lp
        WHERE lp.lecture_id = p.lecture_id AND lp.user_id = p.user_id
      ) AS is_purchased_student
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.category = 'qa' AND p.lecture_id = $1
    ORDER BY p.created_at DESC
    `,
    [lectureId]
  );

  // 댓글 붙이기
  for (const post of posts) {
    const { rows: comments } = await db.query(
      `
      SELECT qc.id, qc.content, qc.created_at, u.nickname, u.id AS user_id
      FROM qna_comments qc
      JOIN users u ON qc.user_id = u.id
      WHERE qc.post_id = $1
      ORDER BY qc.created_at ASC
      `,
      [post.id]
    );
    post.comments = comments;
  }

  return posts;
};
