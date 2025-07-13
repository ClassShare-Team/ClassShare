const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const https = require('https');
const path = require('path');
const os = require('os');
const db = require('../db'); // 기존 DB 연결 모듈 사용

const downloadAndMeasure = async (url) => {
  const tmpPath = path.join(os.tmpdir(), `temp-${Date.now()}.mp4`);
  const file = fs.createWriteStream(tmpPath);

  await new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      })
      .on('error', reject);
  });

  const duration = await getVideoDurationInSeconds(tmpPath);
  fs.unlink(tmpPath, () => {});
  return Math.floor(duration);
};

(async () => {
  const client = await db.pool.connect();
  try {
    const { rows: videos } = await client.query(
      `SELECT id, video_url FROM videos WHERE duration_sec IS NULL LIMIT 3`
    );

    for (const video of videos) {
      const duration = await downloadAndMeasure(video.video_url);
      await client.query(`UPDATE videos SET duration_sec = $1 WHERE id = $2`, [duration, video.id]);
      console.log(`video_id ${video.id} → ${duration}s`);
    }
  } catch (err) {
    console.error('오류 발생:', err);
  } finally {
    client.release();
  }
})();
