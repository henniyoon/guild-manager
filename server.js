const express = require('express');
const path = require('path');
const app = express();
const mariadb  = require('mariadb');
const cors = require('cors');
const bcrypt = require('bcrypt');

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
      const query = 'UPDATE Record SET weekly_score = ?, suro_score = ?, flag_score = ?';
      console.log("실행 쿼리:", query, record);
      await conn.query(query, [record.weekly_score, record.suro_score, record.flag_score]);
    }

    res.json({ message: '업데이트 성공' });
  } catch (err) {
    console.error("데이터베이스 업데이트 실패:", err.message);
    res.status(500).send('서버 오류 발생');
  } finally {
    if (conn) conn.release();
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      res.status(401).send('사용자를 찾을 수 없습니다.');
      return;
    }

    const user = rows[0];
    // 비밀번호 검증 (여기서는 bcrypt를 사용하여 해시된 비밀번호를 검증합니다)
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (passwordIsValid) {
      res.json({ message: '로그인 성공!', userId: user.id });
      // JWT 발급 등의 추가적인 인증 처리를 여기에 구현할 수 있습니다.
    } else {
      res.status(401).send('비밀번호가 잘못되었습니다.');
    }
  } catch (err) {
    console.error('데이터베이스 에러:', err);
    res.status(500).send('서버 에러');
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