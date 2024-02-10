const RecordService = require('../services/recordService.js');
const Record = require('../models/Record.js');
const jwt = require('jsonwebtoken');

const getRecordsController = async (req, res) => {
    const week = req.query.week;
    
    // 요청 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN" 형식 가정

    // 토큰이 없는 경우 오류 처리
    if (!token) {
        return res.status(401).send("토큰이 필요합니다.");
    }

    try {
        // 토큰 검증
        const decoded = jwt.verify(token, "WE_MUST_HIDE_THIS_KEY");
        console.log(decoded)
        // 검증 성공 후, 데이터베이스 조회
        const records = await RecordService.getRecords(week);

        const response = records.map(record => ({
            ...record.toJSON(),
            character_name: record.character?.name
        }));

        res.json(response);
    } catch (error) {
        // 토큰 만료 오류 처리
        if (error.name === 'TokenExpiredError') {
            console.error("토큰이 만료되었습니다:", error);
            return res.status(401).send("토큰이 만료되었습니다. 다시 로그인해주세요.");
        } else if (error.name === 'JsonWebTokenError') {
            // 다른 JWT 오류 처리
            console.error("유효하지 않은 토큰입니다:", error);
            return res.status(401).send("유효하지 않은 토큰입니다.");
        } else {
            // 기타 서버 오류 처리
            console.error("Records 테이블을 불러오는 데 실패했습니다:", error);
            return res.status(500).send("서버 에러");
        }
    }
}

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
