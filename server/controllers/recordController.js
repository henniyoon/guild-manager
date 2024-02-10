const RecordService = require('../services/recordService.js');
const Record = require('../models/Record.js');
const Guild = require('../models/Guild.js');
const jwt = require('jsonwebtoken');

const getRecordsController = async (req, res) => {
    const week = req.query.week;
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN" 형식 가정

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

        // 길드 정보를 사용하여 더 많은 로직을 처리할 수 있습니다.
        // 예: decoded의 정보를 바탕으로 records 조회
        const records = await RecordService.getRecords(week);
console.log(`11111111111 : `,guildInfo)
        const response = records.map(record => ({
            ...record.toJSON(),
            character_name: record.character?.name,
            guild_info: guildInfo // 길드 정보 추가
        }));

        res.json(response);
    } catch (error) {
        // 토큰 만료 오류 처리
        if (error.name === 'TokenExpiredError') {
            console.error("토큰이 만료되었습니다:", error);
            return res.status(401).send("토큰이 만료되었습니다. 다시 로그인해주세요.");
        } else if (error.name === 'JsonWebTokenError') {
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
        const { character_name, weekly_score, suro_score, flag_score, week } = req.body;
        const newRecord = await RecordService.addRecord(character_name, weekly_score, suro_score, flag_score, week);
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
          id: id
        }
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
    deleteRecordsController
};
