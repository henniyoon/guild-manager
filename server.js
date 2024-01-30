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
  host: 'localhost',
  user: 'root',
  password: '0000',
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
}); 