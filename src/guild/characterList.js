const axios = require("axios");
const cheerio = require("cheerio");
const saveMember = require('../../db.js');

async function scrapeRankTable(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const characterNames = [];

    const rankTable = $("table.rank_table");

    rankTable.find("tr").each((rowIndex, row) => {
      $(row)
        .find("td a")
        .each((colIndex, link) => {
          characterNames.push($(link).text().trim());
        });
    });

    return characterNames;
  } catch (error) {
    console.error("오류 발생:", error);
    return [];
  }
}

async function scrapeData(gid, numPages) {
  const promises = [];

  for (let i = 1; i <= numPages; i++) {
    const url = `https://maplestory.nexon.com/Common/Guild?gid=${gid}&wid=0&orderby=1&page=${i}`;
    promises.push(scrapeRankTable(url));
  }

  const characterNames = await Promise.all(promises);
  return characterNames.flat(); // 2D 배열을 1D 배열로 평탄화
}

async function main() {
  const mainGuildId = 402812;
  const subGuildId = 312443;
  const numPages = 10;

  const mainCharacterNames = await scrapeData(mainGuildId, numPages);
  const subCharacterNames = await scrapeData(subGuildId, numPages);

  // console.log("Main Character Names:", mainCharacterNames);
  // console.log("Sub Character Names:", subCharacterNames);

  // 데이터베이스에 저장
  saveMember(mainCharacterNames);
}

main();
