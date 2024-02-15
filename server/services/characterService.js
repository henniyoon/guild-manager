const Guild = require('../models/Guild.js');
const Character = require('../models/Character.js');
const WorldService = require('./worldService.js');
const GuildService = require('./guildService.js');
const APIService = require('./apiService.js');

async function getCharacter(characterName) {
    const character = await Character.findOne({ where: { name: characterName } });
    return character;
}

async function getCharactersByGuild(guildName, worldName) {
    const worldId = await WorldService.getWordId(worldName);
    const guildId = await GuildService.getGuildId(guildName, worldId);
    const characters = await Character.findAll({ where: { guild_id: guildId } });
    return characters;
}

async function createCharacter(guildName, worldName, characterName) {
    const worldId = await WorldService.getWordId(worldName);
    const guildId = await GuildService.getGuildId(guildName, worldId);
    try {
        let apiData = await APIService.getCharacterOcid(characterName);
        apiData = {
            ...apiData,
            ... await APIService.getCharacterBasicData(apiData.ocid)
        };
       
        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);
        await Character.create({
            guild_id: guildId,
            name: characterName,
            ocid: apiData.ocid,
            class: apiData.character_class,
            level: apiData.character_level,
            image: apiData.character_image,
            last_updated: apiDate,
        });
        console.log(characterName, "캐릭터 정보 추가 성공");


    } catch (error) {
        console.error('에러 발생:', error);

        // 에러가 발생하면 특정 필드만 null로 설정하여 저장
        const nullCharacterData = {
            guild_id: guildId,
            name: characterName,
            ocid: null,
            class: null,
            level: null,
            image: null,
            last_updated: null,
        };

        await Character.create(nullCharacterData);
        console.log("에러 발생으로 캐릭터 정보 일부만 추가");
    }
}

async function updateCharacter(guildName, worldName, characterName) {
    const worldId = await WorldService.getWordId(worldName);
    const guildId = await GuildService.getGuildId(guildName, worldId);
    try {
        let apiData = await APIService.getCharacterOcid(characterName);
        apiData = {
            ...apiData,
            ... await APIService.getCharacterBasicData(apiData.ocid)
        };
        // console.log("apiData:", apiData);

        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);
        await Character.update({
            guild_id: guildId,
            name: characterName,
            class: apiData.character_class,
            level: apiData.character_level,
            image: apiData.character_image,
            last_updated: apiDate,
        }, { where: { ocid: apiData.ocid } }
        );
        console.log(characterName, "캐릭터 정보 업데이트 성공");

    } catch (error) {
        console.error('에러 발생:', error);       
        console.log("에러 발생으로 캐릭터 정보 업데이트 실패");
    }
}

module.exports = {
    getCharacter,
    getCharactersByGuild,
    createCharacter,
    updateCharacter,
}