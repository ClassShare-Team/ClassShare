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
  if (!thumbnailFile) throw { status: 405, message: '썸네일이 필요합니다.' };
  if (videoFiles.length === 0) throw { status: 406, message: '강의 영상이 없습니다.' };
  if (videoFiles.length !== videoTitles.length)
    throw { status: 407, message: '영상 수와 제목 수가 일치하지 않습니다.' };

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
    // 예외 로그 및 롤백
    await client.query('ROLLBACK');

    console.error('[createLecture] 트랜잭션 오류:', err);
    if (err?.stack) console.error(err.stack);

    throw err; // 컨트롤러로 전파
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

// 강의 단건 조회
exports.getLectureById = async (lectureId) => {
  const result = await db.query(
    `
    SELECT
      l.id,
      l.title,
      l.description,
      l.instructor_id,
      u.nickname AS instructor_nickname,
      u.profile_image AS instructor_profile_image,
      l.category,
      l.price,
      l.thumbnail,
      l.created_at
    FROM lectures l
    JOIN users u ON l.instructor_id = u.id
    WHERE l.id = $1
  `,
    [lectureId]
  );

  return result.rows[0];
};

// 단건 강의 커리큘럼 조회
exports.getCurriculumByLectureId = async (lectureId) => {
  const result = await db.query(
    `
    SELECT
      title,
      duration_sec
    FROM videos
    WHERE lecture_id = $1
    ORDER BY order_index ASC
  `,
    [lectureId]
  );

  return result.rows.map((video) => ({
    title: video.title,
    duration: formatDuration(video.duration_sec),
  }));
};

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return null;
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes}:${sec.toString().padStart(2, '0')}`;
}

// 강의 무료 구매
exports.purchaseLecture = async (userId, lectureId) => {
  // 가격 조회
  const lectureResult = await db.query(`SELECT price FROM lectures WHERE id = $1`, [lectureId]);
  if (lectureResult.rows.length === 0) {
    throw new Error('해당 강의가 존재하지 않습니다.');
  }

  const price = lectureResult.rows[0].price;

  // 이미 구매했는지 확인
  const exists = await db.query(
    `
    SELECT 1 FROM lecture_purchases WHERE user_id = $1 AND lecture_id = $2
  `,
    [userId, lectureId]
  );

  if (exists.rows.length > 0) {
    return { alreadyPurchased: true };
  }

  // 구매 등록
  await db.query(
    `
    INSERT INTO lecture_purchases (user_id, lecture_id, price)
    VALUES ($1, $2, $3)
  `,
    [userId, lectureId, price]
  );

  return { success: true };
};
