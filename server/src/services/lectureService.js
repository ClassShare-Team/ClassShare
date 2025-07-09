const db   = require('../db');
const path = require('path');

module.exports.createLecture = async ({
  instructorId,
  title,
  description,
  price,
  category,
  thumbnail,
  lecturesMeta,
  files
}) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');


    const {
      rows: [lecture]
    } = await client.query(
      `INSERT INTO lectures
        (instructor_id, title, description, price, category, thumbnail)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, public_id`,
      [instructorId, title, description, price, category, thumbnail]
    );


    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const meta = lecturesMeta[i];           // { title: '1강 …' }

      const relativeUrl = path
        .join('/uploads/videos', path.basename(file.destination), file.filename)
        .replace(/\\/g, '/');                

      await client.query(
        `INSERT INTO videos
          (lecture_id, title, video_url, order_index)
         VALUES ($1, $2, $3, $4)`,
        [lecture.id, meta.title || `Lecture ${i + 1}`, relativeUrl, i + 1]
      );
    }

    await client.query('COMMIT');
    return {
      message: '강의가 성공적으로 생성되었습니다.',
      lecturePublicId: lecture.public_id
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
