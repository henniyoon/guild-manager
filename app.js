const express = require('express');
const path = require('path');
const mariadb = require('mariadb');

const app = express();
const port = 3030; // 사용할 포트 번호

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'guild_manager',
  port: 3307,
  connectionLimit: 5,
});

// public 폴더 내의 정적 파일 (index.html)을 제공
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------------------------------
async function createTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255)
      );
    `);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

// Express 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 테이블 생성 함수 호출
createTable();

// GET 요청 처리 - 폼 반환
app.get('/', (req, res) => {
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
    return res.status(400).json({ error: 'Names are required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const namesArray = JSON.parse(names);

    for (const name of namesArray) {
      await conn.query('INSERT INTO members (name) VALUES (?)', [name.trim()]);
    }

    res.status(200).json({ message: 'Members added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (conn) conn.end();
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});