const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 경로 자동 생성
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true }); // 없으면 생성
  return dir;
}

/* ──────────────────────────────────────────
  프로필 사진 업로드 (profileImage)
      - 경로 : /uploads/profiles/
      - 파일명: profile_<timestamp>.<ext>
────────────────────────────────────────── */
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = ensureDir(path.join(__dirname, '..', 'uploads', 'profiles'));
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `profile_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

module.exports.uploadProfileImage = multer({
  storage: profileStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('image/* 형식만 허용됩니다.'));
  },
});

/* ──────────────────────────────────────────
  강의 영상 업로드 (videos[])
      - 경로 : /uploads/videos/YYYY-MM-DD/
      - 파일명: <timestamp>-<random>.<ext>
────────────────────────────────────────── */
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date().toISOString().slice(0, 10); // 2025-07-02
    const dir = ensureDir(path.join(__dirname, '..', 'uploads', 'videos', today));
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${ext}`);
  },
});

module.exports.uploadVideos = multer({
  storage: videoStorage,
  limits: { fileSize: 1024 * 1024 * 500 }, // 500 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('video/* 형식만 허용됩니다.'));
  },
});
