const express = require('express');
const path = require('path');
const db = require('./db');
const inputRoutes = require('./routes/input');

const app = express();
const port = 3030; // 사용할 포트 번호

// Public 폴더 내의 정적 파일 (index.html)을 제공
app.use(express.static(path.join(__dirname, 'public')));

// Sequelize 모델 동기화
(async () => {
  try {
    await db.sync();
    console.log('Sequelize models synchronized.');
  } catch (error) {
    console.error('Sequelize synchronization error:', error);
  }
})();

// Express 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 라우트 설정
app.use('/input', inputRoutes);

// 서버 시작
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('문제가 발생했습니다!');
});
