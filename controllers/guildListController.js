const { getAllMembers } = require('../services/memberService.js');

// 컨트롤러 로직: 데이터 조회 및 템플릿 렌더링
async function getMainMemberList(req, res) {
    try {
        const mainMembers = await getAllMembers();
        res.render('mainMemberList', { mainMembers });
    } catch (error) {
        console.error('데이터 조회 에러:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getMainMemberList };