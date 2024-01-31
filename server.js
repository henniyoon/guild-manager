const express = require('express');
const path = require('path');
const app = express();
const mariadb  = require('mariadb');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

const pool = mariadb.createPool({
  host: 'database-for-guild.clewymu6ct5n.ap-northeast-2.rds.amazonaws.com',
  user: 'root',
  password: '123123123',
  database: 'database_for_guild',
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

app.post('/api/updateRecords', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const records = req.body;

    for (let record of records) {
      const query = 'UPDATE Record SET score = ?, suro = ?, flag = ? WHERE name = ?';
      console.log("실행 쿼리:", query, record);
      await conn.query(query, [record.score, record.suro, record.flag, record.name]);
    }

    res.json({ message: '업데이트 성공' });
  } catch (err) {
    console.error("데이터베이스 업데이트 실패:", err.message);
    res.status(500).send('서버 오류 발생');
  } finally {
    if (conn) conn.release();
  }
});

// ! 이 코드는 다른 라우터들보다 아래에 위치하여야 합니다.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// ! 조심해주세요!

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
}); 