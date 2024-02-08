const express = require('express');
const recordRouter = express.Router();

const RecordController = require('../controllers/recordController.js');

// 주간 점수 기록 조회
recordRouter.get('/records', RecordController.getRecordsController);

// 주간 점수 기록 추가
recordRouter.post('/records', RecordController.addRecordController);

// 주간 점수 기록 수정
recordRouter.post('/updateRecords', RecordController.updateRecordsController);

// 주간 점수 기록 삭제
recordRouter.delete('/deleteRecord/:id', RecordController.deleteRecordsController)

module.exports = recordRouter;
