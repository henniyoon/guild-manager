const express = require("express");
const router = express.Router();
const memberListController = require("../controllers/memberListController");
const nobleLimit = require("../models/nobleLimit");
const NobleLimitController = require("../controllers/nobleLimitController");
const inputController = require("../controllers/inputController");
const addMemberController = require("../controllers/addMemberController");
const {findLimit} = require("../controllers/findLimitController");

// 라우트 정의: 특정 URL 경로에 대한 요청을 컨트롤러로 전달
router.get("/memberList", memberListController.getMemberList);

router.get("/nobleLimit", NobleLimitController.NobleLimitController);

router.get("/input", inputController.inputController);

router.get("/findLimit", findLimit)

router.post("/addMembers", addMemberController.addMemberController);

router.post("/updateSubMember", memberListController.updateSubMember);

module.exports = router;
