require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => {
    console.log('RDS(PostgreSQL) 연결 성공');
  })
  .catch((err) => {
    console.error('RDS 연결 실패:', err.message);
    process.exit(1);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
