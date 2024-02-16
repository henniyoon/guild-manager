const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./db.js");
require("./models/modelAssociations.js");
const jwt = require("jsonwebtoken");
const Guild = require("./models/Guild.js");
const Character = require("./models/Character.js");
const Record = require("./models/Record.js");
const { Op } = require("sequelize");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const { exec } = require("child_process");

const recordRoutes = require("./routes/recordRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const dataFetcherRoutes = require("./routes/dataFetcherRoutes.js");

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 등록
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

// DB 연결 확인
sequelize
  .authenticate()
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err.message);
  });

// API 라우터 등록
app.use(recordRoutes);
app.use(authRoutes);
app.use(dataFetcherRoutes);

// admin 페이지 캐릭터 채우는 로직
app.post("/test", (req, res) => {
  // Authorization 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer 키워드를 제거합니다.
  const week = req.body.selectedDate;

  if (token == null) {
    return res.sendStatus(401); // 토큰이 없는 경우 401 Unauthorized 응답을 보냅니다.
  }

  // 토큰을 해독하여 사용자 정보를 추출합니다.
  jwt.verify(token, "WE_MUST_HIDE_THIS_KEY", async (err, decodedToken) => {
    if (err) return res.sendStatus(403); // 토큰이 유효하지 않은 경우 처리

    // 추출한 사용자 정보를 이용하여 DB를 조회합니다.
    const guildWorldId = decodedToken.guild_world_id;
    const guildName = decodedToken.guild_name;

    try {
      // Guild 모델을 사용하여 조건에 맞는 길드를 조회합니다.
      const guild = await Guild.findOne({
        where: {
          world_id: guildWorldId,
          name: guildName,
        },
        attributes: ["id"], // 조회할 필드 지정, 여기서는 id만 필요합니다.
      });

      if (guild) {
        // 해당 길드 ID에 속한 모든 길드원을 조회합니다.
        const characters = await Character.findAll({
          where: {
            guild_id: guild.id,
          },
          attributes: ["id"], // 길드원의 id만 필요합니다.
        });

        const characterIds = characters.map((character) => character.id);

        // records 테이블에서 각 character_id와 week에 대해 조회 또는 생성
        const recordsPromises = characterIds.map((characterId) => {
          return Record.findOrCreate({
            where: {
              character_id: characterId,
              week: week,
            },
            defaults: {
              // findOrCreate에서 레코드를 생성할 때 사용될 기본값을 설정할 수 있습니다.
              // 여기에 필요한 모든 기본값을 추가하세요.
              weekly_score: 0, // 예시: 기본값으로 0을 설정
              suro_score: 0,
              flag_score: 0,
              noble_limit: false,
            },
          });
        });

        const records = await Promise.all(recordsPromises);

        // 생성되거나 찾아진 레코드의 정보를 응답으로 보냅니다.
        res.json(records.map((record) => record[0])); // findOrCreate는 [instance, created] 배열을 반환합니다.
      } else {
        // 해당 조건에 맞는 길드가 없는 경우
        res.status(404).send("Guild not found");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});

const upload = multer({ dest: "uploads/" }); // 임시 저장소 설정

// 이미지 업로드 및 처리를 위한 라우트
// 'processed' 디렉토리가 없으면 생성
const processedDirPath = path.join(__dirname, "processed");
if (!fs.existsSync(processedDirPath)) {
  fs.mkdirSync(processedDirPath, { recursive: true });
}

app.post("/uploadImages", upload.array("files", 15), async (req, res) => {
  const weekly_score_Area = [];
  const suro_score_Area = [];
  const flag_score_Area = [];

  for (const file of req.files) {
    // 주간 점수 영역 전처리
    const processedFilePathWeekly = path.join(
      processedDirPath,
      `weekly_${file.originalname}`
    );
    await sharp(file.path)
      .extract({ left: 462, top: 151, width: 60, height: 415 })
      .threshold(120)
      .blur(0.5)
      .toFile(processedFilePathWeekly);
    weekly_score_Area.push(processedFilePathWeekly);

    // 수로 점수 영역 전처리
    const processedFilePathSuro = path.join(
      processedDirPath,
      `suro_${file.originalname}`
    );
    await sharp(file.path)
      .extract({ left: 604, top: 151, width: 60, height: 415 })
      .threshold(120)
      .blur(0.5)
      .toFile(processedFilePathSuro);
    suro_score_Area.push(processedFilePathSuro);

    // 플래그 점수 영역 전처리
    const processedFilePathFlag = path.join(
      processedDirPath,
      `flag_${file.originalname}`
    );
    await sharp(file.path)
      .extract({ left: 528, top: 151, width: 60, height: 415 })
      .threshold(120)
      .blur(0.5)
      .toFile(processedFilePathFlag);
    flag_score_Area.push(processedFilePathFlag);
  }

  // 전처리된 이미지에 대해 OCR 처리
  // 각 영역별로 OCR 명령어 실행
  async function processOcr(processedFiles) {
    const processedImagePaths = processedFiles
      .map((file) => `"${file}"`)
      .join(" ");
    const command = `python ocr.py ${processedImagePaths}`;
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(error || stderr);
        } else {
          resolve(
            stdout
              .trim()
              .split("\n")
              .map((result) => JSON.parse(result.replace(/'/g, '"')))
          );
        }
      });
    });
  }

  try {
    const resultsWeekly = await processOcr(weekly_score_Area);
    const resultsSuro = await processOcr(suro_score_Area);
    const resultsFlag = await processOcr(flag_score_Area);

    const concatenatedResults = {
      weekly_score_Area: resultsWeekly.reduce(
        (acc, current) => acc.concat(current),
        []
      ),
      suro_score_Area: resultsSuro.reduce(
        (acc, current) => acc.concat(current),
        []
      ),
      flag_score_Area: resultsFlag.reduce(
        (acc, current) => acc.concat(current),
        []
      ),
    };

    // 전처리된 파일들을 삭제하는 로직
    const allProcessedFiles = suro_score_Area.concat(
      weekly_score_Area,
      flag_score_Area
    );
    for (const filePath of allProcessedFiles) {
      await fs.promises.unlink(filePath);
    }

    console.log("OCR 작업 완료한 파일들이 삭제되었습니다.");

    // 합쳐진 결과 반환
    res.send({
      message: "OCR 처리 및 파일 삭제 완료",
      concatenatedResults: concatenatedResults,
    });
  } catch (error) {
    console.error(`OCR 처리 중 오류: ${error}`);
    res.status(500).send("OCR 처리 중 오류 발생");
  }
});

app.get("/Graphpage/:memberName", async (req, res) => {
  try {
    const { memberName } = req.params;
    // Characters 테이블에서 memberName으로 캐릭터를 조회합니다.
    const character = await Character.findOne({
      raw: true,
      where: { name: memberName },
      attributes: ["id"], // 캐릭터의 ID만 조회합니다.
    });

    if (!character) {
      return res.status(404).send("Character not found");
    }

    // 해당 캐릭터 ID를 가진 모든 레코드를 조회합니다.
    const records = await Record.findAll({
      raw: true,
      where: { character_id: character.id },
    });

    if (!records) {
      return res.status(404).send("Records not found");
    }

    // 조회된 레코드를 JSON 형태로 반환합니다.
    res.json(records);
    console.log("records : ", records);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ! 이 코드는 다른 라우터들보다 아래에 위치하여야 합니다.
// 클라이언트 리액트 앱 라우팅 처리
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
// ! 조심해주세요!

// 서버 시작
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
