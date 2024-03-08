const TimeService = require('./timeService.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { deflate } = require('zlib');
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
async function getHistoryCharacterNames(apiKey, historyType) {
    try {
        const characterNames = [];

        const today = new Date();
        today.setHours(today.getHours() + 9);  // 시간 보정

        // 30일치만 조회
        for (let i = 0; i < 30; i++) {
            const apiDate = new Date(today);
            apiDate.setDate(today.getDate() - i);
            const formattedApiDate = apiDate.toISOString().split('T')[0];

            let historyUrl;

            switch (historyType) {
                case 'potential':
                    historyUrl = `${API_BASE_URL}/history/potential?count=10&date=${formattedApiDate}`;
                    break;
                case 'cube':
                    historyUrl = `${API_BASE_URL}/history/cube?count=10&date=${formattedApiDate}`;
                    break;
                case 'starforce':
                    historyUrl = `${API_BASE_URL}/history/starforce?count=10&date=${formattedApiDate}`
                    break;
                default:
                    console.error('올바르지 않은 타입입니다.');
                    return;
            }

            const historyResponse = await getApiResponse(historyUrl, apiKey);

            if (historyResponse && historyResponse[`${historyType}_history`] && historyResponse[`${historyType}_history`][0]) {
                characterNames.push(historyResponse[`${historyType}_history`][0].character_name);
            }
            // 만일 characterNames 배열에 3개 이상의 데이터가 들어가면 루프를 중단
            if (characterNames.length >= 3) {
                break;
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