const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/guild', (req, res) => {
  const { server, input } = req.query;
  
  // 여기에서 server와 input 값에 대한 로직을 처리합니다.
  console.log(`서버: ${server}, 입력값: ${input}`);

  // 처리 결과를 클라이언트에 응답으로 보냅니다.
  res.json({ message: `서버: ${server}, 입력값: ${input}을(를) 받았습니다.` });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});