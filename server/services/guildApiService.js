const APIService = require('./apiService.js');

const API_BASE_URL = "https://open.api.nexon.com/maplestory/v1";
const GUILD_ID_ENDPOINT = "/guild/id"
const GUILD_BASIC_ENDPOINT = "/guild/basic";
const CHARACTER_BASIC_ENDPOINT = "/character/basic";

const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
const formattedDate = currentDate.toISOString().split('T')[0];

async function getOguildId(guild, worldName) {
    const guildIdUrl = `${API_BASE_URL}${GUILD_ID_ENDPOINT}?guild_name=${encodeURIComponent(guild)}&world_name=${encodeURIComponent(worldName)}`;
    return await APIService.getApiResponse(guildIdUrl);
}

async function getGuildBasicData(oguildId) {
    const guildDataUrl = `${API_BASE_URL}${GUILD_BASIC_ENDPOINT}?oguild_id=${oguildId}&date=${formattedDate}`;
    return await APIService.getApiResponse(guildDataUrl);
}

async function getCharacterOcid(characterName) {
    const characterOcidUrl = `${API_BASE_URL}/id?character_name=${encodeURIComponent(characterName)}`;
    return await APIService.getApiResponse(characterOcidUrl);
}

async function getCharacterBasicData(ocid) {
    const characterDataUrl = `${API_BASE_URL}${CHARACTER_BASIC_ENDPOINT}?ocid=${encodeURIComponent(ocid)}&date=${formattedDate}`;
    return await APIService.getApiResponse(characterDataUrl);
}

module.exports = {
    getOguildId,
    getGuildBasicData,
    getCharacterOcid,
    getCharacterBasicData,
};
