require('dotenv').config();
require('./src/db');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 5000;

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const lectureRoutes = require('./src/routes/lectureRoutes');
const likesRoutes = require('./src/routes/likesRoutes');
const followRoutes = require('./src/routes/followRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

// CORS 설정
const whitelist = [process.env.CLIENT_URL, 'https://classshare.netlify.app'];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/lectures', lectureRoutes);
app.use('/likes', likesRoutes);
app.use('/follows', followRoutes);
app.use('/comments', commentRoutes);
app.use('/reviews', reviewRoutes);

app.get('/', (_, res) => res.send('API up and running'));

app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  if (err?.stack) console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Express 서버 실행 중 (포트: ${port})`);
});
