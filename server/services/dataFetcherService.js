const axios = require('axios');
const World = require('../models/World.js');
const Guild = require('../models/Guild.js');
const Character = require('../models/Character.js');

// config.json 파일을 읽어서 JSON 파싱
const fs = require('fs');
const path = require('path');

// 현재 스크립트 파일의 경로를 기준으로 config.json 파일의 경로 계산
const configPath = path.join(__dirname, '../config/config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);

// API 키 얻기
const API_KEY = config.apiKey;

const API_BASE_URL = "https://open.api.nexon.com/maplestory/v1";
const GUILD_ID_ENDPOINT = "/guild/id"
const GUILD_BASIC_ENDPOINT = "/guild/basic";
const CHARACTER_BASIC_ENDPOINT = "/character/basic";

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

    // 길드가 DB에 존재하지 않으면
    if (!guildExists) {
        const oguild_id_url = `${API_BASE_URL}${GUILD_ID_ENDPOINT}?guild_name=${encodeURIComponent(guild)}&world_name=${encodeURIComponent(world_name)}`;
        try {
            // API 조회
            const apiResponse = await axios.get(oguild_id_url, {
                headers: {
                    "x-nxopen-api-key": API_KEY,
                },
            });

            const apiData = apiResponse.data;

            // DB에 저장
            await Guild.create({
                world_id: world.id,
                name: guild,
                oguild_id: apiData.oguild_id,
                last_updated: new Date(),

            });

            console.log(apiData);

            return apiData;
        } catch (error) {
            console.error('api 조회 db 저장 에러:', error);
            throw new Error('서버 에러');
        }
    };
    // 이 API 조회 전에 'last_updated가 조회일 오전 1시 이전이면' 이라는 조건 필요!
    const currentDate = new Date();                 // 현재 날짜 객체 생성
    currentDate.setDate(currentDate.getDate() - 1); // 어제 날짜로 설정 (하루를 밀리초 단위로 계산하여 뺌)
    const formattedDate = currentDate.toISOString().split('T')[0];  // 날짜를 YYYY-MM-DD 형식으로 포매팅

    const guildData = await Guild.findOne({
        where: {
            name: guild,
            world_id: world.id,
        },
    });

    const guild_data_url = `${API_BASE_URL}${GUILD_BASIC_ENDPOINT}?oguild_id=${guildData.oguild_id}&date=${formattedDate}`;
    try {
        // API 조회
        const apiResponse = await axios.get(guild_data_url, {
            headers: {
                "x-nxopen-api-key": API_KEY,
            },
        });
        const apiData = apiResponse.data;

        await Guild.update(
            {
                master_name: apiData.guild_master_name,
                member_count: apiData.guild_member_count,
                level: apiData.guild_level,
                noblesse_skill_level: apiData.guild_noblesse_skill.reduce((sum, skill) => sum + skill.skill_level, 0),
                guild_mark: apiData.guild_mark,
                guild_mark_custom: apiData.guild_mark_custom,
                last_updated: new Date(),
            },
            {
                where: { id: guildData.id },
            }
        );
        // console.log("Entering for loop");
        for (const characterName of apiData.guild_member) {
            const characterExists = await Character.findOne({ where: { name: characterName } });

            if (characterExists) {
                // 이미 존재하는 경우 업데이트
                await characterExists.update(
                    {
                        guild_id: guildData.id,
                    },
                    {
                        where: { name: characterName },
                    }
                );
                // console.log(`${characterName} 업데이트 완료`);
            } else {
                await Character.create({
                    guild_id: guildData.id,
                    name: characterName,
                    // class: ,
                    // level:,
                    // image:,
                    // last_updated:,
                });
            };
        };
        console.log("업데이트 완료");

        


        // console.log("apiData:", apiData);
    } catch (error) {
        console.error('api 조회 db 저장 에러:', error);
        throw new Error('서버 에러');
    };


};

guildData("새벽", "스카니아");

module.exports = {
    guildData,
};
