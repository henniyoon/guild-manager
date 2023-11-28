const axios = require("axios");
const cheerio = require("cheerio");

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

module.exports = { scrapeRankTable };