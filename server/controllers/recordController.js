const GuildService = require('../services/guildService.js');
const CharacterService = require('../services/characterService.js');
const RecordService = require('../services/recordService.js');
const AuthService = require('../services/authService.js');

const getRecordsController = async (req, res) => {
  const week = req.query.week;
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN" 형식 가정
  console.log("getRecordToken: ", token);
  if (!token) {
    return res.status(401).send("토큰이 필요합니다.");
  }

  try {
    // 토큰 검증 및 디코딩
    const decoded = AuthService.verifyToken(token);
    console.log("getRecordDecodedToken: ", decoded);
    // 길드 정보 조회
    const guildName = decoded.guild_name;
    const worldName = decoded.world_name;
    const guildInfo = await GuildService.getGuild(guildName, worldName);

    if (!guildInfo) {
      return res.status(404).send("해당하는 길드를 찾을 수 없습니다.");
    }

    // 길드에 속한 캐릭터들 조회
    const characters = await CharacterService.getCharactersByGuild(guildName, worldName);
    // characters 배열을 id를 키로 하는 객체로 변환하여 검색을 빠르게 함
    const charactersMap = characters.reduce((acc, character) => {
      acc[character.id] = character;
      return acc;
    }, {});

    // 각 캐릭터에 대한 records 데이터 조회 및 캐릭터 이름 추가
    const charactersRecords = await Promise.all(
      characters.map(async (character) => {
        const records = await RecordService.getRecordsByCharacterId(character.id, week);
        return records.map((record) => ({
          ...record.toJSON(),
          character_name: character.name, // 캐릭터 이름 추가
        }));
      })
    );
    const response = charactersRecords.flat(); // flat()을 사용하여 중첩 배열을 단일 배열로 평탄화
    
    res.json(response);
  } catch (error) {
    // 오류 처리
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
  // Authorization 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer 키워드를 제거합니다.
  const week = req.body.selectedDate;

  if (token == null) {
    return res.sendStatus(401); // 토큰이 없는 경우 401 Unauthorized 응답을 보냅니다.
  }

  // 토큰을 해독하여 사용자 정보를 추출합니다.
  try {
    const decodedToken = AuthService.verifyToken(token);
    // 추출한 사용자 정보를 이용하여 DB를 조회합니다.
    const worldName = decodedToken.world_name;
    const guildName = decodedToken.guild_name;

    try {
      // Guild 모델을 사용하여 조건에 맞는 길드를 조회합니다.
      const guild = await GuildService.getGuildId(guildName, worldName);

      if (guild) {
        // 해당 길드 ID에 속한 모든 길드원을 조회합니다.
        const characters = await CharacterService.getCharactersByGuild(guildName, worldName);

        const characterIds = characters.map((character) => character.id);

        // records 테이블에서 각 character_id와 week에 대해 조회 또는 생성
        const recordsPromises = characterIds.map((characterId) => {
          return new Promise(async (resolve) => {
            const record = await RecordService.findOrCreateRecords(characterId, week);
            resolve(record);
          });
        });
        
        const records = await Promise.all(recordsPromises);
        
        // 생성되거나 찾아진 레코드의 정보를 응답으로 보냅니다.
        res.json(records);
      } else {
        // 해당 조건에 맞는 길드가 없는 경우
        res.status(404).send("Guild not found");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    // 토큰 검증 실패 시 403 Forbidden 응답을 보냅니다.
    res.sendStatus(403);
  };
};

module.exports = {
  addRecordController,
  getRecordsController,
  updateRecordsController,
  deleteRecordsController,
  fillCharactersController,
};
