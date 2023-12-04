const express = require('express');
const path = require('path');
const sequelize = require('./db.js');
const routes = require('./routes/routes.js');
const inputRoutes = require('./routes/input');

const app = express();

// View Engine 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Public 폴더 내의 정적 파일 (index.html)을 제공
app.use(express.static(path.join(__dirname, 'public')));

// Express 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 라우트 설정
app.use('/', routes);
app.use('/input', inputRoutes); // 추후 routes.js에 합칠 것

// Sequelize 모델 동기화
(async () => {
  try {
    await sequelize.sync({ force: false }); // 기존 DB를 보존하고 변경 사항만 적용
    console.log('Sequelize models synchronized.');
  } catch (error) {
    console.error('Sequelize synchronization error:', error);
  }
})();

// 서버 시작
const port = process.env.PORT || 3030; // 사용할 포트 번호
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('문제가 발생했습니다!');
});