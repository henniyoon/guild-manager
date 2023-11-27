const MainMember = require('../models/mainMember');

async function saveIfNotExists(characterNames) {
  try {
    for (const name of characterNames) {
      const existingMember = await MainMember.findOne({ where: { name } });

      if (!existingMember) {
        await MainMember.create({ name });
        console.log('DB 저장 완료');
      } else {
        console.log('DB가 이미 존재합니다.');
      }
    }
  } catch (err) {
    console.error('데이터 저장 에러', err);
  }
}

async function findAllMembers() {
  try {
    return await MainMember.findAll({ attributes: ['name'], raw: true });
  } catch (error) {
    console.error('데이터 조회 에러:', error);
    throw error;
  }
}

module.exports = { saveIfNotExists, findAllMembers };