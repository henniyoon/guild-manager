const TimeService = require('./timeService.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config/config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);
const API_KEY = config.apiKey;

const API_BASE_URL = "https://open.api.nexon.com/maplestory/v1";

function apiDate() {
    // API 조회를 위한 시간 설정
    const koreaTime = TimeService.getCurrentKoreaTime();
    // 시간이 1시 이전인지 확인 (NEXON OPEN API 갱신이 1시에 됨)
    // getHours() 할 때 한국 시간으로 가져오려고 하는지 +9시간을 한 결과가 나와서 10시로 설정
    if (koreaTime.getHours() < 10) {
        // 1시 이전이면 2일 전의 날짜로 설정
        koreaTime.setDate(koreaTime.getDate() - 2);
    } else {
        // 1시 이후면 어제의 날짜로 설정
        koreaTime.setDate(koreaTime.getDate() - 1);
    }
    const formattedDate = koreaTime.toISOString().split('T')[0];

    return formattedDate;
}

const formattedDate = apiDate();

// nexon open api 조회 
async function getApiResponse(url, apiKey = API_KEY) {
    try {
        const response = await axios.get(url, { headers: { "x-nxopen-api-key": apiKey } });
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

// 월드명과 ocid로 캐릭터 유니온 랭킹 조회 (본캐 찾기)
async function getMainCharacterName(worldName, ocid) {
    const unionRankingUrl = `${API_BASE_URL}/ranking/union?date=${formattedDate}&world_name=${encodeURIComponent(worldName)}&ocid=${encodeURIComponent(ocid)}`;

    return await getApiResponse(unionRankingUrl);
}

// 유저의 api Key를 제공 받아 본캐 찾기
async function getHistoryCharacterNames(apiKey) {
    try {
        const characterNames = [];

        const today = new Date();
        today.setHours(today.getHours() + 9);  // 시간 보정

        // 7일치만 조회
        for (let i = 0; i < 7; i++) {
            const apiDate = new Date(today);
            apiDate.setDate(today.getDate() - i);
            const formattedApiDate = apiDate.toISOString().split('T')[0];

            // 잠재능력 재설정 내역
            const potentialHistoryUrl = `${API_BASE_URL}/history/potential?count=10&date=${formattedApiDate}`;
            const potentialHistory = await getApiResponse(potentialHistoryUrl, apiKey);
            if (potentialHistory && potentialHistory.potential_history && potentialHistory.potential_history[0]) {
                characterNames.push(potentialHistory.potential_history[0].character_name);
            }

            // 큐브 사용 내역
            const cubeHistoryUrl = `${API_BASE_URL}/history/cube?count=10&date=${formattedApiDate}`;
            const cubeHistory = await getApiResponse(cubeHistoryUrl, apiKey);
            if (cubeHistory && cubeHistory.cube_history && cubeHistory.cube_history[0]) {
                characterNames.push(cubeHistory.cube_history[0].character_name);
            }

            // 스타포스 강화 내역
            const starforceHistoryUrl = `${API_BASE_URL}/history/starforce?count=10&date=${formattedApiDate}`
            const starforceHistory = await getApiResponse(starforceHistoryUrl, apiKey);
            if (starforceHistory && starforceHistory.starforce_history && starforceHistory.starforce_history[0]) {
                characterNames.push(starforceHistory.starforce_history[0].character_name);
            }
        }
        const uniqueCharacterNames = [...new Set(characterNames)];

        return uniqueCharacterNames;
    } catch (error) {
        console.error('API 조회 에러:', error);
        // throw new Error('서버 에러');
    }
}

module.exports = {
    apiDate,
    getOguildId,
    getGuildBasicData,
    getCharacterOcid,
    getCharacterBasicData,
    getMainCharacterName,
    getHistoryCharacterNames,
};