const sequelize = require('./db.js');
const { fetchData } = require('./services/dataService.js');
const { saveIfNotExists, findAllMembers } = require('./services/memberService.js');
const MainMember = require('./models/mainMember.js');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공');

    await MainMember.sync(); // 테이블이 없다면 생성
    await SubMember.sync();

    // 데이터 스크래핑
    const mainGuildId = 402812;
    const subGuildId = 312443;
    const numPages = 10;

    const mainCharacterNames = await fetchData(mainGuildId, numPages);
    // const subCharacterNames = await fetchData(subGuildId, numPages);

    // 본캐릭 길드원 DB 저장
    await saveIfNotExists(mainCharacterNames);

    // 본캐릭 길드원 조회
    const allMembers = await findAllMembers();
    console.log('별빛 길드원 목록:', allMembers);

  } catch (error) {
    console.error('데이터베이스 조회 에러:', error);
  } finally {
    console.log('데이터베이스 연결 종료');
    sequelize.close();
  }
}

main();