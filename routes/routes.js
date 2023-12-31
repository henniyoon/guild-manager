const express = require("express");
const router = express.Router();

const guildSettingController = require("../controllers/guildSettingController");
const memberListController = require("../controllers/memberListController");
const memberSyncController = require("../controllers/memberSyncController");
const NobleLimitController = require("../controllers/nobleLimitController");
const inputController = require("../controllers/inputController");
const addMemberController = require("../controllers/addMemberController");
const { findLimit } = require("../controllers/findLimitController");

// 라우트 정의: 특정 URL 경로에 대한 요청을 컨트롤러로 전달

// 길드 명부
router.get("/memberList", memberListController.getMemberList);
// 길드 정보 설정창
router.get("/guildSetting", guildSettingController.guildSettingForm);

router.get("/nobleLimit", NobleLimitController.NobleLimitController);


router.get("/input", inputController.inputController);

router.get("/findLimit", findLimit)

router.post("/addMembers", addMemberController.addMemberController);

// 길드 정보 업데이트
router.post("/updateGuildSetting", guildSettingController.updateGuildInfo);

// 길드원 동기화 (메이플 랭킹 페이지에서 스크래핑)
router.post("/memberSync", memberSyncController.syncMemberList);

// 부캐릭 테이블에 본캐릭 정보 추가
router.post("/updateSubMember", memberListController.updateSubMember);

module.exports = router;
