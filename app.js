const express = require('express');
const path = require('path');

const app = express();
const port = 3030; // 사용할 포트 번호

// public 폴더 내의 정적 파일 (index.html)을 제공
app.use(express.static(path.join(__dirname, 'public')));

// 서버를 시작
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

