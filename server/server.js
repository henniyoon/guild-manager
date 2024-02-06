const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sequelize = require('./db.js');
const jwt = require("jsonwebtoken");
const SECRET_KEY = "WE_MUST_HIDE_THIS_KEY";

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
// sequelize.sync()
// .then(() => {
//   console.log('테이블이 성공적으로 생성되었습니다.');
// })
// .catch((err) => {
//   console.error('테이블 생성 실패:', err.message);
// });

// 행 추가 엔드포인트
app.post('/api/record', async (req, res) => {
  try {
    const { character_id, weekly_score, suro_score, flag_score, noble_limit, week } = req.body;
    const newRecord = await Record.create({
      character_id,
      weekly_score,
      suro_score,
      flag_score,
      noble_limit: noble_limit || 0, // noble_limit이 제공되지 않으면 기본값으로 0 사용
      week
    });
    res.json(newRecord);
  } catch (error) {
    console.error('레코드 추가 실패:', error);
    res.status(500).send('서버 에러');
  }
});


// 노블 제한 기록 조회 API
app.get('/api/records', async (req, res) => {
  const week = req.query.week;

  try {
    const records = await Record.findAll({
      attributes: ['id', 'weekly_score', 'suro_score', 'flag_score'],
      include: [{
        model: Characters, // 또는 Characters, 모델 이름에 따라 다름
        as: 'character', // 관계 정의 시 사용한 별칭을 여기에 명시
        attributes: ['name'],
      }],
      where: {
        week: week
      }
    });

    // `records.map` 사용 시 정의되지 않은 `records` 변수에 접근하는 오류가 발생할 수 있음
    const response = records.map(record => ({
      ...record.toJSON(),
      character_name: record.character?.name // 옵셔널 체이닝 사용
    }));

    res.json(response);
  } catch (error) {
    console.error("데이터를 불러오는 데 실패했습니다:", error);
    res.status(500).send("서버 에러 발생");
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

// ! 현재 토큰을 localstorage에 저장하는 방식인데 XSS공격에 취약함 
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "비밀번호가 잘못되었습니다." });
    }
    const payload = {
      id: user.id,
      username: user.username,
      // 다른 필요한 정보도 추가할 수 있습니다.
    };
  
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    console.log(token)

    res.json({ message: '로그인 성공', token });
    } catch (error) {
    console.error("로그인 처리 에러:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/api/check-username", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      res.json({ isDuplicate: true });
    } else {
      res.json({ isDuplicate: false });
    }
  } catch (error) {
    console.error("사용자 이름 중복 확인 에러:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/api/check-email", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.json({ isDuplicate: true });
    } else {
      res.json({ isDuplicate: false });
    }
  } catch (error) {
    console.error("이메일 중복 확인 에러:", error);
    res.status(500).json({ message: "서버 에러" });
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