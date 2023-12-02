const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./db.js');
const MainMember = require('./models/mainMember.js');
const SubMember = require('./models/subMember.js');
const { findAllMembers } = require('./services/memberService.js');

app.set('view engine', 'ejs');  // EJS를 사용하도록 설정
app.set('views', path.join(__dirname, 'views'));  // views 폴더를 템플릿 폴더로 설정

app.use(express.static(path.join(__dirname, 'public')));

app.get('/mainGuildList', async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log('데이터베이스 연결 성공');

        const mainMembers = await findAllMembers();

        // EJS 템플릿 사용하여 렌더링
        res.render('mainGuildList', { mainMembers });
    } catch (error) {
        console.error('데이터베이스 조회 에러:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        console.log('데이터베이스 연결 종료');
        sequelize.close();
    }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
