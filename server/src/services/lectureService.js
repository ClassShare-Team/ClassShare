const db = require('../db');

exports.createLecture = async ({
  instructorId,
  title,
  description,
  price,
  category,
  thumbnailFile, // multer-s3
  videoFiles, // 배열
  videoTitles,
}) => {
  if (!thumbnailFile) throw { status: 400, message: '썸네일이 필요합니다.' };
  if (videoFiles.length === 0) throw { status: 400, message: '강의 영상이 없습니다.' };
  if (videoFiles.length !== videoTitles.length)
    throw { status: 400, message: '영상 수와 제목 수가 일치하지 않습니다.' };

  // S3 URL 그대로 사용
  const thumbUrl = thumbnailFile.location;
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // 강의 메타 저장
    const {
      rows: [lecture],
    } = await client.query(
      `INSERT INTO lectures
         (instructor_id, title, description, price, category, thumbnail)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, public_id`,
      [instructorId, title, description, price, category, thumbUrl]
    );

    // 영상들 저장
    for (let i = 0; i < videoFiles.length; i++) {
      const vUrl = videoFiles[i].location; // S3 전체 URL
      await client.query(
        `INSERT INTO videos
           (lecture_id, title, video_url, order_index)
         VALUES ($1,$2,$3,$4)`,
        [lecture.id, videoTitles[i] || `Lecture ${i + 1}`, vUrl, i + 1]
      );
    }

    await client.query('COMMIT');
    return {
      message: '강의가 성공적으로 생성되었습니다.',
      lecturePublicId: lecture.public_id,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// 전체 강의 조회
exports.getAllLectures = async () => {
  const result = await db.query(`
    SELECT
      l.id,
      l.title,
      l.instructor_id,
      u.nickname AS instructor_nickname,
      l.category,
      l.price,
      l.thumbnail,
      l.created_at
    FROM lectures l
    JOIN users u ON l.instructor_id = u.id
    ORDER BY l.created_at DESC
  `);
  return result.rows;
};
