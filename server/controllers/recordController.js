const RecordService = require("../services/recordService.js");
const Record = require("../models/Record.js");
const Guild = require("../models/Guild.js");
const Characters = require("../models/Character.js"); // Characters 모델 경로에 맞게 조정해야 합니다.
const jwt = require("jsonwebtoken");

const secret = "WE_MUST_HIDE_THIS_KEY";

const getRecordsController = async (req, res) => {
    const week = req.query.week;
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN" 형식 가정
  
    if (!token) {
      return res.status(401).send("토큰이 필요합니다.");
    }
  
    try {
      // 토큰 검증 및 디코딩
      const decoded = jwt.verify(token, "WE_MUST_HIDE_THIS_KEY");
  
      // 길드 정보 조회
      const guildInfo = await Guild.findOne({
        where: {
          world_id: decoded.guild_world_id,
          name: decoded.guild_name,
        },
      });
  
      if (!guildInfo) {
        return res.status(404).send("해당하는 길드를 찾을 수 없습니다.");
      }
  
      // 길드에 속한 캐릭터들 조회
      const characters = await Characters.findAll({
        where: { guild_id: guildInfo.id },
      });
  
      // characters 배열을 id를 키로 하는 객체로 변환하여 검색을 빠르게 함
      const charactersMap = characters.reduce((acc, character) => {
        acc[character.id] = character;
        return acc;
      }, {});
  
      // 각 캐릭터에 대한 records 데이터 조회 및 캐릭터 이름 추가
      const charactersRecords = await Promise.all(
        characters.map(async (character) => {
          const records = await Record.findAll({
            where: {
              character_id: character.id,
              week: week,
            },
          });
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
    await Record.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "레코드 삭제 성공" });
  } catch (error) {
    console.error("레코드 삭제 중 오류:", error);
    res.status(500).json({ message: "레코드 삭제 실패" });
  }
};

module.exports = {
  addRecordController,
  getRecordsController,
  updateRecordsController,
  deleteRecordsController,
};
