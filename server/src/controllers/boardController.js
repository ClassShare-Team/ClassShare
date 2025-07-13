const db = require('../db');

exports.getPosts = async (req, res) => {
  const { sort = 'recent', search = '' } = req.query;

  let sortClause = 'p.created_at DESC';
  if (sort === 'likes') sortClause = 'likes DESC';
  else if (sort === 'comments') sortClause = 'comments DESC';

  try {
    const result = await db.query(
      `
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
      WHERE p.title ILIKE $1 OR p.content ILIKE $1
      ORDER BY ${sortClause}
      LIMIT 50
    `,
      [`%${search}%`]
    );

    res.json({ posts: result.rows });
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
