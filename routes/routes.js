const express = require('express');
const router = express.Router();
const memberListController = require('../controllers/memberListController');
const { findNobleLimit } = require('../findNobleLimit');


// 라우트 정의: 특정 URL 경로에 대한 요청을 컨트롤러로 전달
router.get('/memberList', memberListController.getMemberList);

router.get('/nobleLimit', async (req, res) => {
    try {
      const results = await findNobleLimit();
  
      // main_name만 추출
      const mainNames = results.map((result) => result.main_name);
  
      // EJS 템플릿 렌더링
      res.render('nobleLimit', { mainNames });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '내부 서버 오류' });
    }
  });

// sub_member 테이블에 main_name 업데이트를 위한 엔드포인트 추가
router.post('/updateSubMember', memberListController.updateSubMember);

module.exports = router;
