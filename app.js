const express = require('express');
const path = require('path');
const { sequelize, findCharacter } = require('./findCharacter'); // sequelize-setup.js에서 가져오기
const routes = require('./routes/routes');
const inputRoutes = require('./routes/input');

async function startServer() {
  const app = express();

  // 뷰 엔진 및 퍼블릭 폴더 구성
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));

  // Sequelize 모델 동기화
  try {
    await sequelize.sync();
    console.log('Sequelize 모델이 동기화되었습니다.');
  } catch (error) {
    console.error('Sequelize 동기화 오류:', error);
  }

  // Express 미들웨어
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // 라우트
  app.use(routes);
  app.use('/input', inputRoutes);

  // '/data' 엔드포인트에 데이터 조회 및 API 제공
  app.get('/data', async (req, res) => {
    try {
      const result = await findCharacter();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '내부 서버 오류' });
    }
  });

  // 서버 시작
  const port = process.env.PORT || 3030;
  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
  });

  // 에러 처리 미들웨어
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('문제가 발생했습니다!');
  });
}

startServer();
