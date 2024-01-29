const { fetchData } = require('../utils/scraping.js');
const {
  saveMembersIfNotExist, 
  deleteMembersNotInList, 
  getAllMembers 
}= require('../services/memberService');

// 비즈니스 로직: 길드 데이터 스크래핑
async function fetchGuildData(guildId) {
  const promises = [];

  for (let i = 1; i <= 10; i++) {
    const url = `https://maplestory.nexon.com/Common/Guild?gid=${guildId}&wid=0&orderby=1&page=${i}`;
    promises.push(fetchData(url));
  }

  const characterNames = await Promise.all(promises);
  return characterNames.flat(); // 2D 배열을 1D 배열로 평탄화
}

// 비즈니스 로직: 길드 데이터 스크래핑 및 멤버 저장
async function fetchAndSaveMembers(guildId, MemberModel) {
    const characterNames = await fetchGuildData(guildId);
    await saveMembersIfNotExist(characterNames, MemberModel);
    await deleteMembersNotInList(characterNames, MemberModel);
}

module.exports = { fetchAndSaveMembers };