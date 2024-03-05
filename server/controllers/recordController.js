const GuildService = require('../services/guildService.js');
const CharacterService = require('../services/characterService.js');
const RecordService = require('../services/recordService.js');

const getRecordsController = async (req, res) => {
  const week = req.query.week;
  // 헤더에서 User-Info 추출
  const userInfoHeader = req.get('User-Info');

  if (!userInfoHeader) {
    return res.status(400).send("User-Info 헤더가 누락되었습니다.");
  }

  let userInfo;
  try {
    // JSON 형태로 전달된 경우 안전하게 파싱
    userInfo = JSON.parse(decodeURIComponent(userInfoHeader));
  } catch (error) {
    // JSON 파싱 실패 처리
    return res.status(400).send("User-Info 헤더의 JSON 형식이 잘못되었습니다.");
  }

  // 사용할 데이터 추출
  const { username, email, guildName, worldName, role } = userInfo;

  if (!userInfo) {
    return res.status(401).send("길드 관리자가 아닙니다.");
  }

  try {
    const guildInfo = await GuildService.getGuild(guildName, worldName);

    if (!guildInfo) {
      return res.status(404).send("해당하는 길드를 찾을 수 없습니다.");
    }

    const characters = await CharacterService.getCharactersByGuild(guildName, worldName);
    const charactersMap = characters.reduce((acc, character) => {
      acc[character.id] = character;
      return acc;
    }, {});

    const charactersRecords = await Promise.all(
      characters.map(async (character) => {
        const records = await RecordService.getRecordsByCharacterId(character.id, week);
        return records.map((record) => ({
          ...record.toJSON(),
          character_name: character.name,
          main_character_name: character.main_character_name,
        }));
      })
    );
    const response = charactersRecords.flat();

    res.json(response);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("토큰이 만료되었습니다:", error);
      return res.status(401).send("토큰이 만료되었습니다. 다시 로그인해주세요.");
    } else if (error.name === "JsonWebTokenError") {
      console.error("유효하지 않은 토큰입니다:", error);
      return res.status(401).send("유효하지 않은 토큰입니다.");
    } else {
      console.error("서버 에러", error);
      return res.status(500).send("서버 에러");
    }
  }
};


const addRecordController = async (req, res) => {
  try {
    const { character_name, weekly_score, suro_score, flag_score, week } =
      req.body;
    const newRecord = await RecordService.addRecord(
      character_name,
      weekly_score,
      suro_score,
      flag_score,
      week
    );
    res.json(newRecord);
  } catch (error) {
    console.error("Record 추가 실패:", error);
    res.status(500).send("서버 에러");
  }
};

const updateRecordsController = async (req, res) => {
  const updatedRecords = req.body;
  console.log('11111111111111', updatedRecords)
  try {
    const result = await RecordService.updateRecords(updatedRecords);
    res.json(result);
  } catch (error) {
    console.error("Records 테이블 업데이트 실패:", error.message);
    res.status(500).send("서버 에러");
  }
};

const deleteRecordsController = async (req, res) => {
  const id = req.params.id;
  try {
    await RecordService.deleteRecords(id);
    res.status(200).json({ message: "레코드 삭제 성공" });
  } catch (error) {
    console.error("레코드 삭제 중 오류:", error);
    res.status(500).json({ message: "레코드 삭제 실패" });
  }
};

// admin 페이지 캐릭터 채우는 로직
const fillCharactersController = async (req, res) => {
  const userInfoHeader = req.get('User-Info');

  if (!userInfoHeader) {
    return res.status(400).send("User-Info 헤더가 누락되었습니다.");
  }

  let userInfo;
  try {
    userInfo = JSON.parse(decodeURIComponent(userInfoHeader));
  } catch (error) {
    return res.status(400).send("User-Info 헤더의 JSON 형식이 잘못되었습니다.");
  }

  // userInfo가 null이거나 undefined인 경우를 검사
  if (!userInfo) {
    return res.status(400).send("User-Info 정보가 없습니다.");
  }

  // 이 시점에서 userInfo는 null이 아니므로 안전하게 구조 분해 할당을 사용할 수 있습니다.
  const { guildName, worldName } = userInfo;
  const week = req.body.selectedDate;

  if (!userInfo) {
    return res.sendStatus(401);
  }

  try {
    const guild = await GuildService.getGuildId(guildName, worldName);

    if (guild) {
      const characters = await CharacterService.getCharactersByGuild(guildName, worldName);
      const characterIds = characters.map((character) => character.id);

      const recordsPromises = characterIds.map((characterId) => {
        return new Promise(async (resolve) => {
          const record = await RecordService.findOrCreateRecords(characterId, week);
          resolve(record);
        });
      });

      const records = await Promise.all(recordsPromises);
      res.json(records);
    } else {
      res.status(404).send("Guild not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = {
  addRecordController,
  getRecordsController,
  updateRecordsController,
  deleteRecordsController,
  fillCharactersController,
};
