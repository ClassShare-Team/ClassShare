const db = require('../db');

exports.getPosts = async (req, res) => {
  const { sort = 'recent', search = '', page = 1, limit = 9 } = req.query;

  const offset = (page - 1) * limit;
  let sortClause = 'p.created_at DESC';
  if (sort === 'likes') sortClause = 'likes DESC';
  else if (sort === 'comments') sortClause = 'comments DESC';

  try {
    const postsQuery = `
      SELECT
        p.id,
        p.title,
        p.content,
        u.nickname AS author,
        p.created_at,
        COALESCE(pl.like_count, 0) AS likes,
        COALESCE(c.comment_count, 0) AS comments
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS like_count
        FROM post_likes
        GROUP BY post_id
      ) pl ON p.id = pl.post_id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comment_count
        FROM comments
        GROUP BY post_id
      ) c ON p.id = c.post_id
      WHERE (p.title ILIKE $1 OR p.content ILIKE $1) AND p.category = 'general'
      ORDER BY ${sortClause}
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) FROM posts p
      WHERE (p.title ILIKE $1 OR p.content ILIKE $1) AND p.category = 'general'
    `;

    const [postsResult, countResult] = await Promise.all([
      db.query(postsQuery, [`%${search}%`, limit, offset]),
      db.query(countQuery, [`%${search}%`]),
    ]);

    const posts = postsResult.rows;
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({ posts, totalCount });
  } catch (err) {
    console.error('게시글 목록 조회 실패:', err);
    res.status(500).json({ message: '게시글 목록 조회 실패' });
  }
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: '제목과 내용을 입력하세요.' });
  }

  try {
    await db.query(
      `INSERT INTO posts (user_id, title, content, category) VALUES ($1, $2, $3, $4)`,
      [userId, title, content, 'general']
    );
    res.status(201).json({ message: '게시글 등록 완료' });
  } catch (err) {
    console.error('게시글 등록 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.getPostById = async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await db.query(
      `
      SELECT
        p.id,
        p.title,
        p.content,
        p.created_at,
        u.nickname AS author,
        COALESCE(c.comment_count, 0) AS comments
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comment_count
        FROM comments
        GROUP BY post_id
      ) c ON p.id = c.post_id
      WHERE p.id = $1
      `,
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    res.json({ post: result.rows[0] });
  } catch (err) {
    console.error('게시글 조회 실패: ', err);
    res.status(500).json({ message: '게시글 조회 실패' });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await db.query(`SELECT user_id FROM posts WHERE id = $1`, [postId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    const postOwnerId = result.rows[0].user_id;
    if (postOwnerId !== userId) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);
    res.json({ message: '게시글이 삭제되었습니다.' });
  } catch (err) {
    console.error('게시글 삭제 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: '제목과 내용을 입력하세요.' });
  }

  try {
    const result = await db.query(`SELECT user_id FROM posts WHERE id = $1`, [postId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    if (result.rows[0].user_id !== userId) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }

    await db.query(`UPDATE posts SET title = $1, content = $2 WHERE id = $3`, [
      title,
      content,
      postId,
    ]);
    res.json({ message: '게시글이 수정되었습니다.' });
  } catch (err) {
    console.error('게시글 수정 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.getComments = async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await db.query(
      `
      SELECT c.id, c.content, c.created_at, u.nickname AS author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
      `,
      [postId]
    );

    res.json({ comments: result.rows });
  } catch (err) {
    console.error('댓글 조회 실패:', err);
    res.status(500).json({ message: '댓글 조회 실패' });
  }
};

exports.createComment = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: '댓글 내용을 입력하세요.' });
  }

  try {
    await db.query(`INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`, [
      postId,
      userId,
      content,
    ]);
    res.status(201).json({ message: '댓글이 등록되었습니다.' });
  } catch (err) {
    console.error('댓글 작성 실패:', err);
    res.status(500).json({ message: '댓글 작성 실패' });
  }
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await db.query(`SELECT user_id FROM comments WHERE id = $1`, [commentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
    }

    if (result.rows[0].user_id !== userId) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await db.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    console.error('댓글 삭제 실패:', err);
    res.status(500).json({ message: '댓글 삭제 실패' });
  }
};
