const { Sequelize } = require('sequelize');

const SubMember = require('../models/subMemberModel');

// 비즈니스 로직
// 스크래핑 리스트가 해당 테이블에 없으면 저장
async function saveMembersIfNotExist(characterNames, MemberModel) {
  try {
    for (const name of characterNames) {
      const existingMember = await MemberModel.findOne({ where: { name } });

      if (!existingMember) {
        await MemberModel.create({ name });
        console.log('DB 저장 완료');
      } else {
        console.log('DB가 이미 존재합니다.');
      }
    }
  } catch (err) {
    console.error('데이터 저장 에러', err);
  }
}

// 해당 테이블에는 있으나 스크래핑 리스트에는 없는 데이터 삭제
async function deleteMembersNotInList(characterNames, MemberModel) {
  try {
    // 해당 테이블에서 스크래핑한 데이터에 존재하지 않는 데이터 찾기
    const notInList = await MemberModel.findAll({
      where: {
        name: {
          [Sequelize.Op.notIn]: characterNames,
        },
      },
    });

    // 찾은 데이터 삭제
    if (notInList.length > 0) {
      await MemberModel.destroy({
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

// 해당 테이블의 전체 name 필드 조회
async function getAllMembers(MemberModel) {
  try {
    return await MemberModel.findAll({ 
      attributes: ['name'], 
      raw: true 
    });
  } catch (error) {
    console.error('데이터 조회 에러:', error);
    throw error;
  }
}

// 부캐릭 테이블의 전체 name 필드와 main_name 필드 조회
async function getAllSubMembers() {
  try {
      return await SubMember.findAll({ 
        attributes: ['name', 'main_name'],
        order: [['main_name', 'ASC']],  // main_name 필드에 대해 오름차순 정렬
        raw: true
      })
  } catch (error) {
      console.error('데이터 조회 에러:', error);
      throw error;
  }
}

module.exports = {
  saveMembersIfNotExist,
  deleteMembersNotInList,
  getAllMembers,
  getAllSubMembers,
};