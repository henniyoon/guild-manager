const axios = require('axios');
const World = require('../models/World.js');
const Guild = require('../models/Guild.js');
const Character = require('../models/Character.js');

const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config/config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);

const API_KEY = config.apiKey;
const API_BASE_URL = "https://open.api.nexon.com/maplestory/v1";
const GUILD_ID_ENDPOINT = "/guild/id"
const GUILD_BASIC_ENDPOINT = "/guild/basic";
const CHARACTER_BASIC_ENDPOINT = "/character/basic";

const currentDate = new Date();                 // 현재 날짜 객체 생성
currentDate.setDate(currentDate.getDate() - 1); // 어제 날짜로 설정 (하루를 밀리초 단위로 계산하여 뺌)
const formattedDate = currentDate.toISOString().split('T')[0];  // 날짜를 YYYY-MM-DD 형식으로 포매팅

async function fetchApiData(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "x-nxopen-api-key": API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error('API 조회 및 DB 저장 에러:', error);
        throw new Error('서버 에러');
    }
}

async function guildData(guild, world_name) {

    // 해당 월드의 월드 번호 조회
    const world = await World.findOne({ where: { name: world_name } });

    // 해당 길드의 DB 존재 여부 확인
    const guildExists = await Guild.findOne({
        where: {
            name: guild,
            world_id: world.id,
        },
    });

    console.log("guildExists:", guildExists);

    // 길드가 DB에 존재하지 않으면
    if (!guildExists) {
        const ocid_url = `${API_BASE_URL}${GUILD_ID_ENDPOINT}?guild_name=${encodeURIComponent(guild)}&world_name=${encodeURIComponent(world_name)}`;
        let apiData = await fetchApiData(ocid_url);
        
        const guild_data_url = `${API_BASE_URL}${GUILD_BASIC_ENDPOINT}?oguild_id=${apiData.oguild_id}&date=${formattedDate}`;
        apiData = {
            ...apiData,
            ...await fetchApiData(guild_data_url),
        };
        // console.log("apiData:", apiData);

        await Guild.findOrCreate({
            where: { oguild_id: apiData.oguild_id },
            defaults: {
                world_id: world.id, 
                name: guild,
                oguild_id: apiData.oguild_id,
                master_name: apiData.guild_master_name,
                member_count: apiData.guild_member_count,
                level: apiData.guild_level,
                noblesse_skill_level: apiData.guild_noblesse_skill.reduce((sum, skill) => sum + skill.skill_level, 0),
                guild_mark: apiData.guild_mark,
                guild_mark_custom: apiData.guild_mark_custom,
                last_updated: new Date(),
            }
        })
    } else {
        await Guild.findOne({
            where: { oguild_id: guildExists.oguild_id } 
        });
    }
}

guildData("새벽", "스카니아");