const db = require('../db');

// 최대 글자 수
const MAX_CONTENT_LEN = 1000;

// 댓글 생성
// @returns {Promise<object>}  새로 만든 댓글 행
exports.createComment = async ({ postId, userId, content }) => {
  // 게시글 존재 확인
  const { rowCount: postExists } = await db.query('SELECT 1 FROM posts WHERE id = $1', [postId]);
  if (!postExists) throw new Error('POST_NOT_FOUND');

  // 사용자 존재 확인
  const { rowCount: userExists } = await db.query('SELECT 1 FROM users WHERE id = $1', [userId]);
  if (!userExists) throw new Error('USER_NOT_FOUND');

  // 콘텐츠 길이 검증
  if (content.trim().length > MAX_CONTENT_LEN) {
    throw new Error('CONTENT_TOO_LONG');
  }

  // 댓글 저장 후 결과 반환
  const { rows } = await db.query(
    `INSERT INTO comments (post_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, post_id AS "postId", user_id AS "userId",
               content, created_at AS "createdAt"`,
    [postId, userId, content.trim()]
  );
  return rows[0];
};
