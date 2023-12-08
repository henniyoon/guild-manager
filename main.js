const sequelize = require('./db');

const GuildInfo = require('./models/guildInfoModel');
const nobleLimit = require('./models/nobleLimit')

async function main() {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공');

    // 테이블이 없다면 생성
    await MainMember.sync();
    await SubMember.sync();
    await GuildInfo.sync();
    await nobleLimit.sync();

    
  } catch (error) {
    console.error('데이터베이스 조회 에러:', error);
  } finally {
    console.log('데이터베이스 연결 종료');
    sequelize.close();
  }
}

main();