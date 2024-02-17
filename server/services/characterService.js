const Guild = require('../models/Guild.js');
const Character = require('../models/Character.js');
const WorldService = require('./worldService.js');
const GuildService = require('./guildService.js');
const APIService = require('./apiService.js');

async function getCharacter(characterName) {
    const character = await Character.findOne({ where: { name: characterName } });
    return character;
}

async function getCharacterByOcid(ocid) {
    const character = await Character.findOne({ where: { ocid: ocid } });

    return character;
}

async function getCharactersByGuild(guildName, worldName) {
    // const worldId = await WorldService.getWorldId(worldName);
    const guildId = await GuildService.getGuildId(guildName, worldName);
    const characters = await Character.findAll({
        where: { guild_id: guildId },
        order: [['name', 'ASC']]
    });
    return characters;
}

async function createCharacter(guildName, worldName, characterName) {
    const worldId = await WorldService.getWorldId(worldName);
    const guildId = await GuildService.getGuildId(guildName, worldName);
    try {
        let apiData = await APIService.getCharacterOcid(characterName);
        apiData = {
            ...apiData,
            ... await APIService.getCharacterBasicData(apiData.ocid),
            ... await APIService.getMainCharacterName(worldName, apiData.ocid)
        };

        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);
        const createdCharacter = await Character.create({
            world_id: worldId,
            guild_id: guildId,
            name: characterName,
            ocid: apiData.ocid,
            class: apiData.character_class,
            level: apiData.character_level,
            main_character_name: apiData.ranking[0].character_name,
            image: apiData.character_image,
            last_updated: apiDate,
        });
        console.log(characterName, "캐릭터 정보 추가 성공");

        return createdCharacter;
    } catch (error) {
        console.error('에러 발생:', error);

        // 에러가 발생하면 특정 필드만 null로 설정하여 저장
        const nullCharacterData = {
            worldId: worldId,
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

async function updateCharacter(characterName) {
    try {
        let apiData = await APIService.getCharacterOcid(characterName);
        apiData = {
            ...apiData,
            ... await APIService.getCharacterBasicData(apiData.ocid),
            ... await APIService.getMainCharacterName(apiData.world_name, apiData.ocid)
        };
        // 업데이트 시점에는 길드를 옮기거나 월드 리프 했을 가능성이 있음!
        const worldId = await WorldService.getWorldId(apiData.world_name);
        const guildId = await GuildService.getGuildId(apiData.character_guild_name, apiData.world_name);

        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);
        const updatedCharacter = await Character.update({
            world_id: worldId,
            guild_id: guildId,
            name: characterName,
            class: apiData.character_class,
            level: apiData.character_level,
            main_character_name: apiData.ranking[0].character_name,
            image: apiData.character_image,
            last_updated: apiDate,
        }, {
            where: { ocid: apiData.ocid },
            individualHooks: true, // 변경된 값이 있는 경우에만 업데이트
        });
        console.log(characterName, "캐릭터 정보 업데이트 성공");

        return updatedCharacter;
    } catch (error) {
        console.error('에러 발생:', error);
        console.log("에러 발생으로 캐릭터 정보 업데이트 실패");
    }
}

async function verifyAdmin(apiKey, guildName, worldName) {
    try {
        const userCharacters = await APIService.getHistoryCharacterNames(apiKey);
        const character = await getCharacter(userCharacters);
        const mainCharacter = character.main_character_name;

        const guild = await GuildService.getGuild(guildName, worldName);
        const guildMaster = guild.master_name;
        const guildMastersMainCharacter = await getCharacter(guildMaster);
        const guildMastersMainCharacterName = guildMastersMainCharacter.main_character_name;

        if (mainCharacter == guildMastersMainCharacterName) {
            console.log("인증 성공");
        } else {
            console.log("인증 실패");
        }
    } catch (error) {
        console.error('에러 발생:', error);
    }

}
module.exports = {
    getCharacter,
    getCharacterByOcid,
    getCharactersByGuild,
    createCharacter,
    updateCharacter,
}

verifyAdmin("test_51a72486d6ea2528359dd65ac6d066018a9039af4e0529bd0432f26e4744123a05f0445e41873440742bb6f5e750d93f", "별빛", "스카니아");
// verifyAdmin("live_8889de2bcdbf2ffc389f01c608c335ad8feab2cc9b5a30e4551a599f1f9956847c78d2cca2b6f310be5c3009a02cd2b3", "초깜찍", "스카니아");