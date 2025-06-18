import express from 'express';
import pool from './db.js';

const app = express();
const port = 5000;

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`DB 연결 성공: ${result.rows[0].now}`);
  } catch (err) {
    console.error('DB 연결 실패:', err);
    res.status(500).send('DB 연결 실패');
  }
});

app.listen(port, () => {
  console.log(`Express 서버 실행 중: http://localhost:${port}`);
});
