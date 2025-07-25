require('dotenv').config();
require('./src/db');
const express = require('express');
const app = express();
const path = require('path');
const port = 5000;
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

app.use(express.json());
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Express 서버 실행 중: http://localhost:${port}`);
});
