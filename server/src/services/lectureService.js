const db = require('../db');
const { getVideoDurationInSeconds } = require('get-video-duration');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const AWS = require('aws-sdk');

// 강의 생성
exports.createLecture = async ({
  instructorId,
  title,
  description,
  price,
  category,
  thumbnailFile,
  videoFiles,
  videoTitles,
}) => {
  // 검증
  if (!thumbnailFile?.location) throw { status: 400, message: '썸네일 업로드 실패' };

  if (!videoFiles?.length) throw { status: 400, message: '영상이 없습니다.' };

  if (videoFiles.length !== videoTitles.length)
    throw { status: 400, message: '영상 수와 제목 수가 일치하지 않습니다.' };

  const numPrice = Number(price);
  if (Number.isNaN(numPrice) || numPrice < 0)
    throw { status: 400, message: 'price는 0 이상의 숫자여야 합니다.' };

  // 트랜잭션
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // 테이블 삽입
    const {
      rows: [lecture],
    } = await client.query(
      `INSERT INTO lectures
         (instructor_id, title, description, price, category, thumbnail)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, public_id`,
      [instructorId, title, description, numPrice, category, thumbnailFile.location]
    );

    // 테이블 병렬 삽입
    await Promise.all(
      videoFiles.map(async (vFile, idx) => {
        let durationSec = null;

        try {
          // 1) 임시 파일 경로 지정
          const tmpPath = path.join(os.tmpdir(), `video-${Date.now()}-${idx}.mp4`);

          // 2) S3에서 임시 파일로 다운로드
          await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(tmpPath);
            https
              .get(vFile.location, (res) => {
                res.pipe(file);
                file.on('finish', () => file.close(resolve));
              })
              .on('error', reject);
          });

          // 3) 영상 길이 측정
          const duration = await getVideoDurationInSeconds(tmpPath);
          durationSec = Math.floor(duration);

          // 4) 임시 파일 삭제
          fs.unlink(tmpPath, () => {});
        } catch (e) {
          console.error(`[createLecture] 영상 길이 측정 실패 (index ${idx}):`, e.message);
        }

        // 5) DB INSERT (duration_sec 포함)
        await client.query(
          `INSERT INTO videos
             (lecture_id, title, video_url, order_index, duration_sec)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            lecture.id,
            videoTitles[idx]?.trim() || `Lecture ${idx + 1}`,
            vFile.location,
            idx + 1,
            durationSec,
          ]
        );
      })
    );

    await client.query('COMMIT');

    // 결과 반환
    return {
      message: '강의가 성공적으로 생성되었습니다.',
      lecturePublicId: lecture.public_id,
    };
  } catch (err) {
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
      l.instructor_id AS instructor,
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
exports.getLectureById = async (id) => {
  const result = await db.query(
    `
    SELECT
      l.*,
      u.nickname        AS instructor_nickname,
      u.profile_image   AS instructor_profile_image
    FROM lectures AS l
    JOIN users AS u ON l.instructor_id = u.id
    WHERE l.id = $1
    `,
    [id]
  );
  return result.rows[0];
};

exports.getCurriculumByLectureId = async (userId, lectureId) => {
  // 먼저 수강권 구매 여부 확인
  const { rows } = await db.query(
    `
    SELECT 1 FROM lecture_purchases
    WHERE user_id = $1 AND lecture_id = $2
    `,
    [userId, lectureId]
  );

  if (rows.length === 0) {
    const err = new Error('수강권 없음');
    err.status = 403;
    throw err;
  }

  // 커리큘럼 조회
  const result = await db.query(
    `
    SELECT
      v.id,
      v.title,
      v.duration_sec,
      COALESCE(p.is_completed, FALSE) AS is_completed
    FROM videos v
    LEFT JOIN progress p ON v.id = p.video_id AND p.user_id = $1
    WHERE v.lecture_id = $2
    ORDER BY v.order_index ASC
    `,
    [userId, lectureId]
  );

  return result.rows.map((video) => ({
    id: video.id,
    title: video.title,
    duration: formatDuration(video.duration_sec),
    is_completed: video.is_completed,
  }));
};

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return null;
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes}:${sec.toString().padStart(2, '0')}`;
}

// 강의 무료 구매 (가격 무시)
exports.purchaseLecture = async (userId, lectureId) => {
  // 강의 존재 여부만 확인
  const lectureResult = await db.query(`SELECT id FROM lectures WHERE id = $1`, [lectureId]);
  if (lectureResult.rows.length === 0) {
    throw new Error('해당 강의가 존재하지 않습니다.');
  }

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

  // 가격 무시하고 무료 구매 등록
  await db.query(
    `
    INSERT INTO lecture_purchases (user_id, lecture_id, price)
    VALUES ($1, $2, 0)
    `,
    [userId, lectureId]
  );

  return { success: true, price: 0 };
};

// 강의 구매 여부 확인
exports.checkLecturePurchased = async (lectureId, userId) => {
  const result = await db.query(
    `
    SELECT EXISTS (
      SELECT 1 FROM lecture_purchases
      WHERE lecture_id = $1 AND user_id = $2
    ) AS is_purchased
    `,
    [lectureId, userId]
  );
  return result.rows[0].is_purchased;
};

// 강의 삭제
exports.deleteLecture = async (lectureId, instructorId) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 소유 확인
    const { rows } = await client.query(
      `SELECT thumbnail FROM lectures WHERE id = $1 AND instructor_id = $2`,
      [lectureId, instructorId]
    );
    if (rows.length === 0) {
      throw { status: 403, message: '해당 강의를 삭제할 권한이 없습니다.' };
    }
    const thumbnail = rows[0].thumbnail;

    // 비디오 정보 조회 (S3 삭제용)
    const videos = await client.query(`SELECT video_url FROM videos WHERE lecture_id = $1`, [
      lectureId,
    ]);

    // 강의 삭제 (cascade 동작)
    await client.query(`DELETE FROM lectures WHERE id = $1`, [lectureId]);

    await client.query('COMMIT');

    // S3 삭제 (비동기)
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });

    const deleteObjects = [
      { Key: new URL(thumbnail).pathname.slice(1) },
      ...videos.rows.map((v) => ({ Key: new URL(v.video_url).pathname.slice(1) })),
    ];

    await s3
      .deleteObjects({
        Bucket: process.env.AWS_S3_BUCKET,
        Delete: { Objects: deleteObjects, Quiet: false },
      })
      .promise();

    console.log(`[deleteLecture] S3 삭제 완료`, deleteObjects);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
