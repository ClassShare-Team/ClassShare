const db = require('../db');

exports.getVideoByIdIfPurchased = async (userId, videoId) => {
  // 비디오 가져오기
  const result = await db.query(
    `
    SELECT v.*, l.id AS lecture_id
    FROM videos v
    JOIN lectures l ON v.lecture_id = l.id
    WHERE v.id = $1
  `,
    [videoId]
  );

  if (result.rows.length === 0) throw new Error('영상 없음');

  const video = result.rows[0];

  // 수강권 구매 여부 확인
  const purchased = await db.query(
    `
    SELECT 1 FROM lecture_purchases
    WHERE user_id = $1 AND lecture_id = $2
  `,
    [userId, video.lecture_id]
  );

  if (purchased.rows.length === 0) {
    const err = new Error('수강권 없음');
    err.status = 403;
    throw err;
  }

  return video;
};

// 페이지 들어갈 때
exports.getProgress = async (userId, videoId) => {
  const result = await db.query(
    `
    SELECT current_seconds, is_completed FROM progress
    WHERE user_id = $1 AND video_id = $2
  `,
    [userId, videoId]
  );
  return result.rows[0] || { current_seconds: 0, is_completed: false };
};

// 페이지 종료할 때
exports.saveProgress = async (userId, videoId, currentSeconds, isCompleted) => {
  await db.query(
    `
    INSERT INTO progress (user_id, video_id, current_seconds, is_completed)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, video_id) DO UPDATE
    SET current_seconds = EXCLUDED.current_seconds,
        is_completed = EXCLUDED.is_completed,
        updated_at = CURRENT_TIMESTAMP
  `,
    [userId, videoId, currentSeconds, isCompleted]
  );
};
