const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/* ────────────────────────────────
   1) 프로필 사진 업로드 (profileImage)
   경로 : server/uploads/profiles/
──────────────────────────────── */
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, ensureDir(path.join(__dirname, '..', '..', 'uploads', 'profiles'))),
  filename: (req, file, cb) => cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`),
});

module.exports.uploadProfileImage = multer({
  storage: profileStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('image/* 형식만 허용됩니다.')),
});

/* ────────────────────────────────
   2) 강의 썸네일 업로드 (thumbnail)
   경로 : server/uploads/thumbnails/YYYY-MM-DD/
──────────────────────────────── */
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date().toISOString().slice(0, 10);
    cb(null, ensureDir(path.join(__dirname, '..', '..', 'uploads', 'thumbnails', today)));
  },
  filename: (req, file, cb) => cb(null, `thumb_${Date.now()}${path.extname(file.originalname)}`),
});

module.exports.uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('image/* 형식만 허용됩니다.')),
});

/* ────────────────────────────────
   3) 강의 영상 업로드 (videos[])
   경로 : server/uploads/videos/YYYY-MM-DD/
──────────────────────────────── */
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date().toISOString().slice(0, 10);
    cb(null, ensureDir(path.join(__dirname, '..', '..', 'uploads', 'videos', today)));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

module.exports.uploadVideos = multer({
  storage: videoStorage,
  limits: { fileSize: 1024 * 1024 * 500 }, // 500 MB
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith('video/')
      ? cb(null, true)
      : cb(new Error('video/* 형식만 허용됩니다.')),
});

/* ────────────────────────────────
   4) 썸네일 + 영상 동시에 받기
   경로 : server/uploads/...
──────────────────────────────── */
const lectureMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date().toISOString().slice(0, 10);
    const base =
      file.fieldname === 'thumbnail'
        ? path.join(__dirname, '..', '..', 'uploads', 'thumbnails', today)
        : path.join(__dirname, '..', '..', 'uploads', 'videos', today);
    cb(null, ensureDir(base));
  },
  filename: (req, file, cb) => {
    const prefix = file.fieldname === 'thumbnail' ? 'thumb_' : '';
    const unique =
      Date.now() + (file.fieldname === 'videos' ? '-' + Math.round(Math.random() * 1e9) : '');
    cb(null, `${prefix}${unique}${path.extname(file.originalname)}`);
  },
});

module.exports.uploadLectureMedia = multer({
  storage: lectureMediaStorage,
  limits: {
    fileSize: 1024 * 1024 * 500, // 영상 최대 크기 기준
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'thumbnail' && !file.mimetype.startsWith('image/'))
      return cb(new Error('썸네일은 image/* 형식만 허용됩니다.'));
    if (file.fieldname === 'videos' && !file.mimetype.startsWith('video/'))
      return cb(new Error('영상은 video/* 형식만 허용됩니다.'));
    cb(null, true);
  },
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videos', maxCount: 20 },
]);
