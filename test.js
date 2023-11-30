// 필요한 모듈을 불러옵니다.
const http = require('http');
const mariadb = require('mariadb');

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
    // 데이터베이스 쿼리
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM main_member');
  
    // HTML 생성
    let html = '<html><head><title>Member List</title></head><body><h1>Member List</h1><ul>';
  
    rows.forEach((row) => {
      html += `<li>ID: ${row.id}, Name: ${row.name}</li>`;
    });
  
    html += '</ul></body></html>';
  
    // 응답 전송
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  
    // 연결 해제
    conn.release();
  });

// 서버를 3000 포트에서 실행
server.listen(3000, () => {
  console.log('http://localhost:3000');
});