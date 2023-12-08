const { getAllMembers, getAllSubMembers } = require('../services/memberService');

const MainMember = require('../models/mainMemberModel');
const SubMember = require('../models/subMemberModel');

// 컨트롤러 로직
//데이터 조회 및 템플릿 렌더링
async function getMemberList(req, res) {
    try {
        const mainMembers = await getAllMembers(MainMember);
        const subMembers = await getAllMembers(SubMember);
        const subMemberMainNames = await getAllSubMembers(SubMember);

        res.render('memberList', { mainMembers, subMembers, subMemberMainNames });
    } catch (error) {
        console.error('데이터 조회 에러:', error);
        res.status(500).send('Internal Server Error');
    }
}

// sub_member 테이블의 main_name 필드 업데이트
async function updateSubMember(req, res) {
    try {
        const subMemberName = req.query.subMemberName;
        const newValue = req.query.newValue;

        await SubMember.update({ main_name: newValue }, { where: { name: subMemberName } });
        res.status(200).json({ success: true, message: '본캐 추가 성공'});
  } catch (error) {
    console.error('본캐 추가 중 오류 발생:', error);
    res.status(500).json({ success: false, message: '본캐 추가 실패' });
  }
};

module.exports = { 
    getMemberList,
    updateSubMember
};