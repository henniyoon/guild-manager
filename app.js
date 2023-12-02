const express = require('express');
const path = require('path');
const db = require('./db');
const restrictionModel = require('./models/restriction');

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

// GET 요청 처리 - 폼 반환
app.get('/input', (req, res) => {
  res.send(`
  <form action="/addMembers" method="post" id="memberForm">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name">
  <button type="button" onclick="addName()">Add Name</button>
  <button type="submit">Add Members</button>
  <ul id="nameList"></ul>
  <input type="hidden" id="namesInput" name="names" value="">
</form>
<script>
  // names 배열 초기화
  let namesArray = [];

  function addName() {
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();

    if (name !== '') {
      namesArray.push(name);
      nameInput.value = '';

      // 추가된 이름을 화면에 표시
      const nameList = document.getElementById('nameList');
      const listItem = document.createElement('li');
      listItem.textContent = name;
      nameList.appendChild(listItem);
    }
  }

  // form submit 이벤트 시 namesInput에 배열 값을 할당
  document.getElementById('memberForm').addEventListener('submit', function (event) {
    const namesInput = document.getElementById('namesInput');
    namesInput.value = JSON.stringify(namesArray);
  });
</script>
  `);
});

// POST 요청 처리
app.post('/addMembers', async (req, res) => {
  const { names } = req.body;

  if (!names || names.length === 0) {
    return res.status(400).json({ error: '이름은 필수입니다.' });
  }

  try {
    const namesArray = JSON.parse(names);

    for (const name of namesArray) {
      await restrictionModel.create({ name: name.trim() });
    }

    res.status(200).json({ message: '멤버가 성공적으로 추가되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('문제가 발생했습니다!');
});