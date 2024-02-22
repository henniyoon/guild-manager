const Record = require('../models/Record.js');
const Character = require('../models/Character.js');

// 비즈니스 로직을 처리하는 서비스

// 노블제한 행 추가
const addRecord = async (character_name, weekly_score, suro_score, flag_score, week) => {
    // Characters 모델을 사용하여 데이터베이스에서 캐릭터 조회
    const character = await Character.findOne({ where: { name: character_name } });
    // ! characters 테이블에 일치하는 닉네임이 없을 때 로직 생각해보기
    if (!character) {
        throw new Error('캐릭터를 찾을 수 없습니다');
    }

    // 조회한 character의 id를 사용하여 새로운 record 생성
    const newRecord = await Record.create({
        character_id: character.id,
        weekly_score,
        suro_score,
        flag_score,
        noble_limit: 0,     // noble_limit는 기본적으로 0으로 설정
        week,
    });

    return newRecord;
};

// 주어진 주(week)에 대한 노블제한 기록을 DB records 테이블에서 조회
const getRecords = async (week) => {
    const records = await Record.findAll({
        attributes: ['id', 'weekly_score', 'suro_score', 'flag_score'],
        include: [{
            model: Character,
            as: 'character', // 관계 정의 시 사용한 별칭을 여기에 명시
            attributes: ['name'],
        }],
        where: {
            week: week
        }
    });
    return records;
};

const findOrCreateRecords = async (characterId, week) => {
    const [record, created] = await Record.findOrCreate({
        where: {
            character_id: characterId,
            week: week,
        },
        defaults: {
            weekly_score: 0,
            suro_score: 0,
            flag_score: 0,
            noble_limit: false,
        },
    });
    
    return record;
};

// 사용자가 업데이트 한 노블제한 기록을 DB records 테이블에 업데이트
const updateRecords = async (updatedRecords) => {
    for (let record of updatedRecords) {
        await Record.update(
            {
                weekly_score: record.weekly_score,
                suro_score: record.suro_score,
                flag_score: record.flag_score,
                noble_limit: record.noble_limit
            },
            {
                where: { id: record.id }
            }
        );
    }
    return { message: '업데이트 성공' };
};

const deleteRecords = async (recordId) => {
    await Record.destroy({ where: { id: recordId } });
    return { message: '삭제 성공' }
};

module.exports = {
    addRecord,
    getRecords,
    findOrCreateRecords,
    updateRecords,
    deleteRecords,
};