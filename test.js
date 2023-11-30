// 필요한 모듈을 불러옵니다.
const http = require('http');
const mariadb = require('mariadb');
const fs = require('fs');

// MariaDB 연결 정보 설정
const pool = mariadb.createPool({
  host: 'localhost',
  port: 3307,
  user: 'root', // 사용자 이름
  password: '0000', // 비밀번호
  database: 'guild_manager', // 데이터베이스 이름
});

// HTTP 서버 생성
const server = http.createServer(async (req, res) => {
  // index.html 파일 읽기
  const htmlFile = fs.readFileSync('./public/index.html', 'utf8');

  // 데이터베이스 쿼리
  const conn = await pool.getConnection();
  const rows = await conn.query('SELECT * FROM main_member');

  // HTML 생성
  let membersHTML = '';

  rows.forEach((row) => {
    membersHTML += `<p>ID: ${row.id}, Name: ${row.name}</p>`;
  });

  // index.html 수정
  // replace 메서드 : 앞 인자를 뒤의 인자로 바꿈
  const modifiedHTML = htmlFile.replace('<div id="root"></div>', `<div id="root">${membersHTML}</div>`);

  // 응답 전송
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(modifiedHTML);

  // 연결 해제
  conn.release();
});

// 서버를 3000 포트에서 실행
server.listen(3030, () => {
  console.log('http://localhost:3030');
});