const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./db.js');
require('./models/modelAssociations.js');

const recordRoutes = require('./routes/recordRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

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

// API 라우터 등록
app.use(recordRoutes);
app.use(authRoutes);

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