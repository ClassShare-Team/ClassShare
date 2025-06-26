require('dotenv').config();
require('./src/db');
const express = require('express');
const app = express();
const port = 5000;
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Express 서버 실행 중: http://localhost:${port}`);
});
