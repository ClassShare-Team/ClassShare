require('dotenv').config();
require('./src/db');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 5000;

// 라우터 임포트
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const lectureRoutes = require('./src/routes/lectureRoutes');
const boardRoutes = require('./src/routes/boardRoutes');

// 미들웨어
app.use(
  cors({
    origin: ['https://classshare.kr'],
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile')));

// 라우터 연결
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/lectures', lectureRoutes);
app.use('/boards', boardRoutes);

// 서버 실행
app.listen(port, () => {
  console.log(`Express 서버 실행 중: http://localhost:${port}`);
});
