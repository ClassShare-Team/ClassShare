const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

//프로필 사진
const uploadProfileImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: (_req, file, cb) => {
      const filename = `profiles/profile_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('이미지 파일만 업로드할 수 있습니다.')),
});

// 강의 썸네일
const uploadThumbnail = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    key: (_req, file, cb) => {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const filename = `thumbnails/${today}/thumb_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('image/* 형식만 허용됩니다.')),
});

// 썸네일 + 영상 업로드
const uploadLectureMedia = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: (_req, file, cb) => {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const isThumb = file.fieldname === 'thumbnail';
      const prefix = isThumb ? `thumbnails/${today}/thumb_` : `videos/${today}/video_`;
      const rand = isThumb ? '' : `-${Math.round(Math.random() * 1e9)}`;

      cb(null, `${prefix}${Date.now()}${rand}${path.extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB per file
  },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === 'thumbnail' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('썸네일은 image/* 형식만 허용됩니다.'));
    }
    if (file.fieldname === 'videos' && !file.mimetype.startsWith('video/')) {
      return cb(new Error('영상은 video/* 형식만 허용됩니다.'));
    }
    cb(null, true);
  },
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videos', maxCount: 20 },
]);

module.exports = {
  uploadProfileImage,
  uploadThumbnail,
  uploadLectureMedia,
};
