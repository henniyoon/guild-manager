const sequelize = require('./db');
const { fetchGuildData } = require('./services/dataService');
const {
  saveMembersIfNotExist, 
  deleteMembersNotInList, 
  getAllMembers 
}= require('./services/memberService');

const MainMember = require('./models/mainMemberModel');
const SubMember = require('./models/subMemberModel');
const nobleLimit = require('./models/nobleLimit')

async function fetchAndSaveMembers(guildId, numPages, MemberModel) {
  try {
    const characterNames = await fetchGuildData(guildId, numPages);
    await saveMembersIfNotExist(characterNames, MemberModel);
    await deleteMembersNotInList(characterNames, MemberModel);

    const allMembers = await getAllMembers(MemberModel);
    console.log('길드원 목록:', allMembers);
  } catch (error) {
    console.error('데이터 조회 에러:', error);
  }
}

async function main() {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공');

    // 테이블이 없다면 생성
    await MainMember.sync();
    await SubMember.sync();
    await nobleLimit.sync();

    // 데이터 스크래핑
    const numPages = 10;

    const mainGuildId = 402812;
    await fetchAndSaveMembers(mainGuildId, numPages, MainMember);

    const subGuildId = 312443;
    await fetchAndSaveMembers(subGuildId, numPages, SubMember);
    
  } catch (error) {
    console.error('데이터베이스 조회 에러:', error);
  } finally {
    console.log('데이터베이스 연결 종료');
    sequelize.close();
  }
}

main();