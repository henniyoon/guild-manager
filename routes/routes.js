const express = require('express');
const router = express.Router();
const memberListController = require('../controllers/memberListController');

// 라우트 정의: 특정 URL 경로에 대한 요청을 컨트롤러로 전달
router.get('/memberList', memberListController.getMemberList);

// sub_member 테이블에 main_name 업데이트를 위한 엔드포인트 추가
router.post('/updateSubMember', memberListController.updateSubMember);

module.exports = router;
