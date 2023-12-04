const { getAllMainMembers } = require('../services/mainMemberService');
const { getAllSubMembers } = require('../services/subMemberService');

// 컨트롤러 로직: 데이터 조회 및 템플릿 렌더링
async function getMemberList(req, res) {
    try {
        const mainMembers = await getAllMainMembers();
        const subMembers = await getAllSubMembers();

        res.render('memberList', { mainMembers, subMembers });
    } catch (error) {
        console.error('데이터 조회 에러:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getMemberList };