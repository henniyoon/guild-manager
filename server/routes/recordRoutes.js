const express = require('express');
const recordRouter = express.Router();

const RecordController = require('../controllers/recordController.js');

// 주간 점수 기록 조회
recordRouter.get('/records', RecordController.getRecordsController);

// admin 페이지 캐릭터 채우는 로직
recordRouter.post('/test', RecordController.fillCharactersController);

// 주간 점수 기록 추가
recordRouter.post('/records', RecordController.addRecordController);

// 주간 점수 기록 수정
recordRouter.post('/updateRecords', RecordController.updateRecordsController);

// 주간 점수 기록 삭제
recordRouter.delete('/deleteRecord/:id', RecordController.deleteRecordsController)

module.exports = recordRouter;
