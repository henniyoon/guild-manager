const express = require('express');
const path = require('path');
const sequelize = require('./db.js');
const routes = require('./routes/routes.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

const port = process.env.PORT || 3030; // 사용할 포트 번호
// 서버를 시작
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});