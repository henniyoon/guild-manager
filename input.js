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

// GET 요청 처리 - 폼 반환
app.get('/', (req, res) => {
  res.send(`
    <form id="memberForm" action="/addMembers" method="post">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
      <button type="button" onclick="addMember()">Add Member</button>
      <table id="memberTable">
        <thead>
          <tr>
            <th>Names</th>
          </tr>
        </thead>
        <tbody id="memberList"></tbody>
      </table>
      <button type="submit">Add Members</button>
    </form>
    <script>
      function addMember() {
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();

        if (name) {
          const tableBody = document.getElementById('memberList');
          const row = tableBody.insertRow();
          const cell = row.insertCell(0);
          cell.textContent = name;

          nameInput.value = '';
        }
      }
    </script>
  `);
});

// 서버 시작
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});