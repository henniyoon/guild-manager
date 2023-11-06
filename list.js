const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const url = 'https://example.com'; // 스크랩할 웹 페이지의 URL을 입력하세요.

  axios.get(url)
    .then((response) => {
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);

        // 원하는 데이터 추출
        const title = $('h1').text(); // 예: <h1> 태그 내의 텍스트 가져오기

        res.send(`페이지 제목: ${title}`);
      }
    })
    .catch((error) => {
      res.status(500).send('데이터 가져오기 실패');
    });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 포트에서 실행 중입니다.`);
});
