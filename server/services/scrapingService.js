const axios = require('axios');
const cheerio = require('cheerio');

const worldNameToId = {
    '리부트2': 1,
    '리부트': 2,
    '오로라': 3,
    '레드': 4,
    '이노시스': 5,
    '유니온': 6,
    '스카니아': 7,
    '루나': 8,
    '제니스': 9,
    '크로아': 10,
    '베라': 11,
    '엘리시움': 12,
    '아케인': 13,
    '노바': 14
};

async function fetchGuildUrl(worldName, guildName) {
    try {
        const worldId = worldNameToId[worldName] || 0;
        const gidUrl = `https://maplestory.nexon.com/N23Ranking/World/Guild?w=${worldId}&t=1&n=${guildName}`;
        const gidResponse = await axios.get(gidUrl);
        const $ = cheerio.load(gidResponse.data);
        const link = $('td.left a').attr('href');
        return `https://maplestory.nexon.com/${link}&orderby=1`;
    } catch (error) {
        console.error('fetchGuildUrl 실패:', error.message);
        throw error;
    }
}

async function scrapeGuild(worldName, guildName) {
    try {
        const guildUrl = await fetchGuildUrl(worldName, guildName);
        const guildResponse = await axios.get(guildUrl);
        const $ = cheerio.load(guildResponse.data);
        const subMasterNames = $('tr:has(td:contains("부마스터")) dl dt a').map((index, element) => {
            return $(element).text().trim();
        }).get();

        console.log('Sub Master Names:', subMasterNames);
    } catch (error) {
        console.error('scrapeGuild 실패:', error.message);
    }
}

module.exports = {
    scrapeGuild,
}

scrapeGuild("스카니아", "새벽");