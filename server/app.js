require('dotenv').config();
require('./src/db');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 5000;
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const lectureRoutes = require('./src/routes/lectureRoutes');
const likesRoutes = require('./src/routes/likesRoutes');
const followRoutes = require('./src/routes/followRoutes');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);


app.use(express.json());
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/lectures', lectureRoutes);

app.listen(port, () => {
  console.log(`Express 서버 실행 중: http://localhost:${port}`);
});
