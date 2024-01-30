const express = require('express');
const path = require('path');
const app = express();
const mariadb  = require('mariadb');
const cors = require('cors');

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const pool = mariadb.createPool({
  host: 'database-for-guild.clewymu6ct5n.ap-northeast-2.rds.amazonaws.com',
  user: 'root',
  password: '123123123',
  database: 'guild_manager',
  connectionLimit: 5
});

async function connectDB() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("데이터베이스 연결 성공");
  } catch (err) {
    console.error("데이터베이스 연결 실패:", err.message);
  } finally {
    if (conn) conn.release();
  }
}

connectDB();

app.get('/api/records', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Record');
    res.json(rows);
  } catch (err) {
    console.error("데이터베이스 쿼리 실행 실패:", err.message);
    res.status(500).send('서버 오류 발생');
  } finally {
    if (conn) conn.release();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
}); 