const axios = require('axios');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config/config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);
const API_KEY = config.apiKey;

const API_BASE_URL = "https://open.api.nexon.com/maplestory/v1";
const UNION_RANKING_ENDPOINT = "/ranking/union";

const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
const formattedDate = currentDate.toISOString().split('T')[0];

async function getApiResponse(url) {
    try {
        const response = await axios.get(url, { headers: { "x-nxopen-api-key": API_KEY } });
        return response.data;
    } catch (error) {
        console.error('API 조회 에러:', error);
        // throw new Error('서버 에러');
    }
}

// 길드명, 월드명으로 oguild_id 조회
async function getOguildId(guild, worldName) {
    const guildIdUrl = `${API_BASE_URL}/guild/id?guild_name=${encodeURIComponent(guild)}&world_name=${encodeURIComponent(worldName)}`;
    return await getApiResponse(guildIdUrl);
}

// oguild_id로 길드 정보 조회
async function getGuildBasicData(oguildId) {
    const guildDataUrl = `${API_BASE_URL}/guild/basic?oguild_id=${oguildId}&date=${formattedDate}`;
    return await getApiResponse(guildDataUrl);
}

// 캐릭터명으로 ocid 조회
async function getCharacterOcid(characterName) {
    const characterOcidUrl = `${API_BASE_URL}/id?character_name=${encodeURIComponent(characterName)}`;
    return await getApiResponse(characterOcidUrl);
}

// ocid로 캐릭터 정보 조회
async function getCharacterBasicData(ocid) {
    const characterDataUrl = `${API_BASE_URL}/character/basic?ocid=${encodeURIComponent(ocid)}&date=${formattedDate}`;
    return await getApiResponse(characterDataUrl);
}

module.exports = {
    getOguildId,
    getGuildBasicData,
    getCharacterOcid,
    getCharacterBasicData,
};
