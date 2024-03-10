const sequelize = require('../db.js');
const Guild = require('../models/Guild.js');
const Character = require('../models/Character.js');
const WorldService = require('./worldService.js');
const GuildService = require('./guildService.js');
const APIService = require('./apiService.js');

async function getCharacter(characterName) {
    return await Character.findOne({ where: { name: characterName } });
}

async function getCharacterByOcid(ocid) {
    const character = await Character.findOne({ where: { ocid: ocid } });

    return character;
}

async function getCharactersByGuild(guildName, worldName) {
    const guildId = await GuildService.getGuildId(guildName, worldName);
    const characters = await Character.findAll({
        where: { guild_id: guildId },
        order: [['name', 'ASC']]
    });
    return characters;
}

async function getSubMasterNames(guildName, worldName) {
    try {
        const guildId = await GuildService.getGuildId(guildName, worldName);
        const subMasters = await Character.findAll({
            where: { guild_id: guildId, guild_role: '부마스터' },
            attributes: ['main_character_name']
        });
        const subMasterNames = subMasters.map(subMaster => subMaster.main_character_name);

        return subMasterNames;
    } catch (error) {
        console.error('에러 발생:', error);
        throw new Error('서버 에러');
    }
}

async function createCharacter(guildName, worldName, characterName, guildRole) {
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

        const character = {
            world_id: worldId,
            guild_id: guildId,
            guild_role: guildRole,
            name: characterName,
            ocid: apiData.ocid,
            class: apiData.character_class,
            level: apiData.character_level,
            main_character_name: apiData.ranking[0].character_name,
            image: apiData.character_image,
            last_updated: apiDate,
        };

        const createdCharacter = await Character.create(character);

        return createdCharacter;
    } catch (error) {
        console.error('에러 발생:', error);
        console.log("worldId: ", worldId);
        // 에러가 발생하면 특정 필드만 null로 설정하여 저장
        const nullCharacterData = {
            world_id: worldId,
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

async function updateCharacter(characterName, guildRole) {
    try {
        let apiData = await APIService.getCharacterOcid(characterName);
        apiData = {
            ...apiData,
            ... await APIService.getCharacterBasicData(apiData.ocid),
            ... await APIService.getMainCharacterName(apiData.world_name, apiData.ocid)
        };
        if (apiData) {
            let character = '';
            
            const characterByOcid = await getCharacterByOcid(apiData.ocid);
            const characterByName = await getCharacter(characterName);
            if (characterByName) {
                character = characterByName;
            } else if (characterByOcid) {
                character = characterByOcid;
            }
            const worldId = await WorldService.getWorldId(apiData.world_name);
            const guildId = await GuildService.getGuildId(apiData.character_guild_name, apiData.world_name);

            const apiDate = new Date(apiData.date);
            apiDate.setHours(apiDate.getHours() + 9);

            const updatedCharacter = {
                world_id: worldId,
                guild_id: guildId,
                guild_role: guildRole,
                name: apiData.character_name,
                ocid: apiData.ocid,
                class: apiData.character_class,
                level: apiData.character_level,
                main_character_name: apiData.ranking[0].character_name,
                image: apiData.character_image,
                last_updated: apiDate,
            };
            const update = await character.update(updatedCharacter);

            return update;
        }
    } catch (error) {
        console.error('에러 발생:', error);
        console.log("에러 발생으로 캐릭터 정보 업데이트 실패");
    }
}

async function removeGuildCharacter(characterName) {
    try {
        const character = await getCharacter(characterName);
        const nullGuild = { guild_id: null };
        await Character.update(nullGuild, { where: { ocid: character.ocid } });
        console.log("탈퇴자 길드 null 설정 성공")
    } catch (error) {
        console.error('에러 발생:', error);
        console.log("에러 발생으로 탈퇴자 길드 null 설정 실패");
    }
}

module.exports = {
    getCharacter,
    getCharacterByOcid,
    getCharactersByGuild,
    getSubMasterNames,
    createCharacter,
    updateCharacter,
    removeGuildCharacter,
}