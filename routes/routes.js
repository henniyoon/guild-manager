const express = require("express");
const router = express.Router();
const memberListController = require("../controllers/memberListController");
const { findNobleLimit } = require("../findNobleLimit");
const nobleLimit = require("../models/nobleLimit");

// 라우트 정의: 특정 URL 경로에 대한 요청을 컨트롤러로 전달
router.get("/memberList", memberListController.getMemberList);

router.get("/nobleLimit", async (req, res) => {
  try {
    const results = await findNobleLimit();

    // main_name만 추출
    const mainNames = results.map((result) => result.main_name);

    // EJS 템플릿 렌더링
    res.render("nobleLimit", { mainNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "내부 서버 오류" });
  }
});

router.get("/input", (req, res) => {
  res.send(`
      <form action="/addMembers" method="post" id="memberForm">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name">
        <button type="button" onclick="addName()">Add Name</button>
        <button type="submit">Add Members</button>
        <ul id="nameList"></ul>
        <input type="hidden" id="namesInput" name="names" value="">
      </form>
      <script>
        // names 배열 초기화
        let namesArray = [];
  
        function addName() {
          const nameInput = document.getElementById('name');
          const name = nameInput.value.trim();
  
          if (name !== '') {
            namesArray.push(name);
            nameInput.value = '';
  
            // 추가된 이름을 화면에 표시
            const nameList = document.getElementById('nameList');
            const listItem = document.createElement('li');
            listItem.textContent = name;
            nameList.appendChild(listItem);
          }
        }
  
        // form submit 이벤트 시 namesInput에 배열 값을 할당
        document.getElementById('memberForm').addEventListener('submit', function (event) {
          const namesInput = document.getElementById('namesInput');
          namesInput.value = JSON.stringify(namesArray);
        });
      </script>
    `);
});

router.post("/addMembers", async (req, res) => {
  const { names } = req.body;

  if (!names || names.length === 0) {
    return res.status(400).json({ error: "이름은 필수입니다." });
  }

  try {
    const namesArray = JSON.parse(names);

    for (const name of namesArray) {
      await nobleLimit.create({ name: name.trim() });
    }

    res.status(200).json({ message: "멤버가 성공적으로 추가되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "내부 서버 오류" });
  }
});

// sub_member 테이블에 main_name 업데이트를 위한 엔드포인트 추가
router.post("/updateSubMember", memberListController.updateSubMember);

module.exports = router;
