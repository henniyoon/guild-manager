const RecordService = require('../services/recordService.js');

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

const getRecordsController = async (req, res) => {
    const week = req.query.week;

    try {
        const records = await RecordService.getRecords(week);

        const response = records.map(record => ({
            ...record.toJSON(),
            character_name: record.character?.name
        }));

        res.json(response);
    } catch (error) {
        console.error("Records 테이블을 불러오는 데 실패했습니다:", error);
        res.status(500).send("서버 에러");
    }
}

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

module.exports = {
    addRecordController,
    getRecordsController,
    updateRecordsController
};
