const axios = require("axios");
const cheerio = require("cheerio");

const mainCharacterName = []; // 본캐 길드 닉네임 저장 배열
const subCharacterName = [];  // 부캐 길드 닉네임 저장 배열
const numPages = 10; // 크롤링할 페이지 수

async function scrapeRankTable(url, array) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // class가 rank_table인 표를 식별
    const rankTable = $("table.rank_table");

    // 표에서 a 태그 안의 정보를 추출
    rankTable.find("tr").each((rowIndex, row) => {
      $(row)
        .find("td a")
        .each((colIndex, link) => {
          array.push($(link).text().trim());
        });
    });
  } catch (error) {
    console.error("오류 발생:", error);
  }
}

async function scrapeData() {
  const promises = [];

  for (let i = 1; i <= numPages; i++) {
    const mainUrl = `https://maplestory.nexon.com/Common/Guild?gid=402812&wid=0&orderby=1&page=${i}`;
    const subUrl = `https://maplestory.nexon.com/Common/Guild?gid=312443&wid=0&orderby=1&page=${i}`;
    promises.push(scrapeRankTable(mainUrl, mainCharacterName));
    promises.push(scrapeRankTable(subUrl, subCharacterName));
  }

  await Promise.all(promises);

  console.log(mainCharacterName);
  console.log(subCharacterName);
}

scrapeData();
