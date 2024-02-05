const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sequelize = require('./db.js');

const Characters = require('./models/Characters.js');
const Guild = require('./models/Guild.js');
const Record = require('./models/Record.js');
const Server = require('./models/Server.js');
const User = require('./models/User.js');

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 등록
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// DB 연결 확인
sequelize.authenticate()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error('데이터베이스 연결 실패:', err.message);
  });

// 테이블 생성
sequelize.sync()
.then(() => {
  console.log('테이블이 성공적으로 생성되었습니다.');
})
.catch((err) => {
  console.error('테이블 생성 실패:', err.message);
});


// 노블 제한 기록 조회 API
app.get('/api/records', async (req, res) => {
  try {
    const rows = await Record.findAll();
    res.json(rows);
  } catch (err) {
    console.error("데이터베이스 쿼리 실행 실패:", err.message);
    res.status(500).send('서버 오류 발생');
  } 
});

// 노블 제한 기록 업데이트 API
app.post('/api/updateRecords', async (req, res) => {
  const records = req.body;

  try {
    for (let record of records) {
      await Record.update(
        {
          weekly_score: record.weekly_score,
          suro_score: record.suro_score,
          flag_score: record.flag_score
        },
        {
          where: { id: record.id }
        }
      );
    }

    res.json({ message: '업데이트 성공' });
  } catch (err) {
    console.error("데이터베이스 업데이트 실패:", err.message);
    res.status(500).send('서버 오류 발생');
  } 
});
  
// 회원가입 API
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json({ message: '회원가입 성공', userId: newUser.id });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ message: '이미 사용중인 이메일 또는 사용자 이름입니다.' });
    } else {
      console.error('회원가입 처리 에러:', error);
      res.status(500).json({ message: '서버 에러' });
    }
  }
});

// 로그인 API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: '비밀번호가 잘못되었습니다.' });
    }
    res.json({ message: '로그인 성공', userId: user.id });
    // JWT 발급 등 추가 로직
  } catch (error) {
    console.error('로그인 처리 에러:', error);
    res.status(500).json({ message: '서버 에러' });
  }
});

// ! 이 코드는 다른 라우터들보다 아래에 위치하여야 합니다.
// 클라이언트 리액트 앱 라우팅 처리
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
// ! 조심해주세요!

// 서버 시작
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});