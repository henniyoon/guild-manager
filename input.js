const express = require('express');
const mariadb = require('mariadb');

const app = express();
const port = 3030;

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'guild_manager',
  port: 3307,
  connectionLimit: 5,
});

// 테이블 생성
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

// 배열을 저장할 변수
let namesArray = [];

// GET 요청 처리 - 폼 반환
app.get('/', (req, res) => {
  res.send(`
  <form action="/addMembers" method="post">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  <button type="button" onclick="addName()">Add Name</button>
  <button type="submit">Add Members</button>
  <ul id="nameList"></ul>
  <input type="hidden" id="namesInput" name="names" value="">
</form>
<script>
  function addName() {
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();

    if (name) {
      namesArray.push(name);
      nameInput.value = '';

      // 추가된 이름을 화면에 표시
      const nameList = document.getElementById('nameList');
      const listItem = document.createElement('li');
      listItem.textContent = name;
      nameList.appendChild(listItem);
    }
  }

  // submit 버튼 클릭 시 namesInput에 배열 값을 할당
  document.querySelector('form').addEventListener('submit', function () {
    const namesInput = document.getElementById('namesInput');
    namesInput.value = JSON.stringify(namesArray);
  });
</script>
  `);
});

// POST 요청 처리
app.post('/addMembers', async (req, res) => {
    const { names } = req.body;
  
    if (!names || !Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: 'Names are required' });
    }
  
    let conn;
    try {
      conn = await pool.getConnection();
  
      for (const name of names) {
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
  console.log(`Server is running on port ${port}`);
});