const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./db.js");
require("./models/modelAssociations.js");
const Character = require("./models/Character.js");
const Record = require("./models/Record.js");
const Guild = require("./models/Guild.js");
const { Op } = require("sequelize");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const { exec } = require("child_process");

const recordRoutes = require("./routes/recordRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const dataFetcherRoutes = require("./routes/dataFetcherRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

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
app.use(userRoutes);


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
    const processedImagePaths = processedFiles.map((file) => `"${file}"`).join(" ");
    const command = `python ocr.py ${processedImagePaths}`;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                console.error("OCR 명령어 실행 중 오류:", error || stderr);
                reject(error || stderr);
            } else {
                try {
                    const results = stdout.trim().split("\n").map(line => {
                        try {
                            return JSON.parse(line.replace(/'/g, '"'));
                        } catch (parseError) {
                            console.error("JSON 파싱 중 오류:", parseError);
                            // 오류가 발생한 경우, null을 반환하거나 다른 방식으로 처리
                            return null;
                        }
                    });
                    resolve(results);
                } catch (e) {
                    console.error("OCR 처리 중 예외 발생:", e);
                    reject(e);
                }
            }
        });
    });
}

  try {
    const resultsWeekly = await processOcr(weekly_score_Area);
    const resultsSuro = await processOcr(suro_score_Area);
    const resultsFlag = await processOcr(flag_score_Area);

    // 전처리된 파일들을 삭제하는 로직
    cleanUpOldFiles('uploads', MAX_FILES);
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
      weekly_score_Area: resultsWeekly.reduce(
        (acc, current) => acc.concat(current),
        []
      ),
      suro_score_Area: resultsFlag.reduce(
        (acc, current) => acc.concat(current),
        []
      ),
      flag_score_Area: resultsSuro.reduce(
        (acc, current) => acc.concat(current),
        []
      ),
    });
  } catch (error) {
    console.error(`OCR 처리 중 오류: ${error}`);
    res.status(500).send("OCR 처리 중 오류 발생");
  }
});

// 최대 저장 가능한 이미지 파일 개수
const MAX_FILES = 1;

// uploads 폴더 내의 파일 정리 함수
function cleanUpOldFiles() {
  const directory = 'uploads';

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    if (files.length > MAX_FILES) {
      // 파일 생성 시간으로 정렬
      files.sort((a, b) => {
        const statA = fs.statSync(path.join(directory, a)).mtime.getTime();
        const statB = fs.statSync(path.join(directory, b)).mtime.getTime();
        return statA - statB;
      });

      // 최대 개수를 초과하는 오래된 파일 삭제
      while (files.length > MAX_FILES) {
        const fileToDelete = files.shift();
        fs.unlinkSync(path.join(directory, fileToDelete));
        console.log(`${fileToDelete} has been deleted`);
      }
    }
  });
}

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

app.post('/updateNobleLimit', async (req, res) => {
  const { selectedRowIds } = req.body;

  try {
    await Record.update(
      { noble_limit: 1 },
      { where: { id: selectedRowIds } }
    );
    res.json({ success: true, message: "noble_limit 업데이트 성공" });
  } catch (error) {
    console.error("noble_limit 업데이트 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러" });
  }
});

app.get('/nobleCheck', async (req, res) => {
  const { world_id, name } = req.query;
  // 'week' 파라미터를 배열로 처리합니다. 이미 배열로 받는 로직이 구현되어 있음.
  let weeks = req.query.weeks;
  if (!Array.isArray(weeks)) {
    weeks = [weeks];
  }
console.log('weeks : ',weeks)
  try {
    const guild = await Guild.findOne({
      where: { world_id, name },
    });

    if (!guild) {
      return res.status(404).json({ success: false, message: '길드를 찾을 수 없습니다.' });
    }

    let charactersByWeek = {};

    // 배열의 모든 요소에 대해 반복하여 각 주차별 데이터 조회
    for (const week of weeks) {
      const charactersWithNobleLimit = await Character.findAll({
        include: [{
          model: Record,
          as: 'records',
          where: { week, noble_limit: true },
          attributes: [],
        }],
        where: { guild_id: guild.id },
        attributes: ['name'],
      });

      // 캐릭터 이름 추출
      charactersByWeek[week] = charactersWithNobleLimit.map(c => c.name);
    }

    res.json({ success: true, message: '조회 성공', charactersByWeek });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.', error: error.message });
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
