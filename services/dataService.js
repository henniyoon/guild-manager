const { scrapeRankTable } = require('../src/utils/scraping');

async function fetchData(gid, numPages) {
  const promises = [];

  for (let i = 1; i <= numPages; i++) {
    const url = `https://maplestory.nexon.com/Common/Guild?gid=${gid}&wid=0&orderby=1&page=${i}`;
    promises.push(scrapeRankTable(url));
  }

  const characterNames = await Promise.all(promises);
  return characterNames.flat(); // 2D 배열을 1D 배열로 평탄화
}

module.exports = { fetchData };