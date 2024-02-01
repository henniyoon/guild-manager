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

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const conn = await pool.getConnection();
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해시
    await conn.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    // username 또는 email의 중복으로 인한 에러 처리
    if (err.code === 'ER_DUP_ENTRY' || err.sqlState === '23000') {
      res.status(409).json({ message: '이미 사용중인 사용자 이름 또는 이메일입니다.' });
    } else {
      console.error('회원가입 처리 에러:', err.message);
      res.status(500).json({ message: '서버 에러' });
    }
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }
    const user = rows[0];
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (passwordIsValid) {
      res.json({ message: '로그인 성공', userId: user.id });
      // 추가 로직: JWT 생성 및 반환 등
    } else {
      res.status(401).json({ message: '비밀번호가 잘못되었습니다.' });
    }
  } catch (err) {
    console.error('로그인 처리 에러:', err.message);
    res.status(500).json({ message: '서버 에러' });
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