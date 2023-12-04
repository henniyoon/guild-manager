const { Sequelize } = require('sequelize');
const MainMember = require('../models/mainMemberModel');

// 비즈니스 로직
// 스크래핑 리스트가 DB에 없으면 DB에 저장
async function saveMainMembersIfNotExist(characterNames) {
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

// DB에는 있으나 스크래핑 리스트에는 없는 데이터 DB에서 삭제
async function deleteMainMembersNotInList(characterNames) {
  try {
    // main_member 테이블에서 스크래핑한 데이터에 존재하지 않는 데이터 찾기
    const notInList = await MainMember.findAll({
      where: {
        name: {
          [Sequelize.Op.notIn]: characterNames,
        },
      },
    });

    // 찾은 데이터 삭제
    if (notInList.length > 0) {
      await MainMember.destroy({
        where: {
          id: {
            [Sequelize.Op.in]: notInList.map(member => member.id),
          },
        },
      });
      console.log('데이터 삭제 완료');
    } else {
      console.log('스크래핑한 데이터에 존재하지 않는 데이터가 없습니다.');
    }

  } catch (err) {
    console.error('데이터 삭제 에러', err);
  }
}

async function getAllMainMembers() {
  try {
    return await MainMember.findAll({ attributes: ['name'], raw: true });
  } catch (error) {
    console.error('데이터 조회 에러:', error);
    throw error;
  }
}

module.exports = {
  saveMainMembersIfNotExist,
  deleteMainMembersNotInList,
  getAllMainMembers
};