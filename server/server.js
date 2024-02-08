const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./db.js');
require('./models/modelAssociations.js');
const jwt = require('jsonwebtoken');
const Guild = require('./models/Guild.js');
const Character = require('./models/Character.js')
const Record = require('./models/Record.js')
const { Op } = require('sequelize');

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
// sequelize.sync()
// .then(() => {
//   console.log('테이블이 성공적으로 생성되었습니다.');
// })
// .catch((err) => {
//   console.error('테이블 생성 실패:', err.message);
// });

// API 라우터 등록
app.use(recordRoutes);
app.use(authRoutes);

app.post('/test', (req, res) => {
  // Authorization 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer 키워드를 제거합니다.
  const week = req.body.selectedDate;

  if (token == null) {
    return res.sendStatus(401); // 토큰이 없는 경우 401 Unauthorized 응답을 보냅니다.
  }

  // 토큰을 해독하여 사용자 정보를 추출합니다.
  jwt.verify(token, 'WE_MUST_HIDE_THIS_KEY', async (err, decodedToken) => {
    if (err) return res.sendStatus(403); // 토큰이 유효하지 않은 경우 처리
  
    // 추출한 사용자 정보를 이용하여 DB를 조회합니다.
    const guildWorldId = decodedToken.guild_world_id;
    const guildName = decodedToken.guild_name;
  
    try {
      // Guild 모델을 사용하여 조건에 맞는 길드를 조회합니다.
      const guild = await Guild.findOne({
        where: {
          world_id: guildWorldId,
          name: guildName,
        },
        attributes: ['id'], // 조회할 필드 지정, 여기서는 id만 필요합니다.
      });
  
      if (guild) {
        // 해당 길드 ID에 속한 모든 길드원을 조회합니다.
        const characters = await Character.findAll({
          where: {
            guild_id: guild.id,
          },
          attributes: ['id'], // 길드원의 id만 필요합니다.
        });
      
        const characterIds = characters.map(character => character.id);
      
        // 여기에서 records 테이블을 조회합니다.
        const records = await Record.findAll({
          where: {
            character_id: { [Op.in]: characterIds }, // characterIds 배열에 있는 ID들을 포함하는 레코드 검색
            week: week, // 주 정보도 검색 조건에 포함
          },
          // 필요한 경우 attributes를 설정하여 특정 필드만 조회할 수 있습니다.
        });
      
        // 조회된 레코드를 응답합니다.
        res.json({ records: records });
      } else {
        // 해당 조건에 맞는 길드가 없는 경우
        res.status(404).send('Guild not found');
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
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