const express = require('express');
const router = express.Router();
const memberListController = require('../controllers/memberListController');

// 라우트 정의: 특정 URL 경로에 대한 요청을 컨트롤러로 전달
router.get('/memberList', memberListController.getMemberList);

module.exports = router;
