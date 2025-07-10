const db = require('../db');
const path = require('path');

exports.createLecture = async ({
  instructorId,
  title,
  description,
  price,
  category,
  thumbnailFile, // <input name="thumbnail">
  videoFiles, // <input name="videos" multiple>
  videoTitles, // <input name="titles"> (files 개수와 동일 길이)
}) => {
  if (!thumbnailFile) throw { status: 400, message: '썸네일이 필요합니다.' };
  if (videoFiles.length === 0) throw { status: 400, message: '강의 영상이 없습니다.' };
  if (videoFiles.length !== videoTitles.length) {
    throw { status: 400, message: '영상 수와 제목 수가 일치하지 않습니다.' };
  }

  // 경로 계산
  const thumbUrl = path
    .join('/uploads/thumbnails', path.basename(thumbnailFile.destination), thumbnailFile.filename)
    .replace(/\\/g, '/');
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 강의 추가
    const {
      rows: [lecture],
    } = await client.query(
      `INSERT INTO lectures
         (instructor_id, title, description, price, category, thumbnail)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, public_id`,
      [instructorId, title, description, price, category, thumbUrl]
    );

    // 영상
    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];
      const vUrl = path
        .join('/uploads/videos', path.basename(file.destination), file.filename)
        .replace(/\\/g, '/');

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
