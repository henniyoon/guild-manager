const express = require('express');
const app = express();
const sequelize = require('./db.js');
const MainMember = require('./models/mainMember.js');
const SubMember = require('./models/subMember.js');
const { findAllMembers } = require('./services/memberService.js');

app.use(express.static('public'));

app.get('/mainGuildList', async (req, res) => {
    console.log('클라이언트에서 /mainGuildList에 대한 요청이 들어왔습니다.');
    try {
        await sequelize.authenticate();
        console.log('데이터베이스 연결 성공');

        // 본캐 목록 조회
        const mainMembers = await findAllMembers();

        // 클라이언트로 데이터 전송
        res.setHeader('Content-Type', 'application/json'); // 수정된 부분
        res.json(mainMembers); // 수정된 부분
    } catch (error) {
        console.error('데이터베이스 조회 에러:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
        console.log('데이터베이스 연결 종료');
        sequelize.close();
    }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
