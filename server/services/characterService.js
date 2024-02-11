const Guild = require('../models/Guild.js');
const Character = require('../models/Character.js');
const WorldService = require('./worldService.js');
const GuildService = require('./guildService.js');
const GuildAPIService = require('./guildApiService.js');

async function createCharacter(characterName) {
    try {
        let apiData = await GuildAPIService.getCharacterOcid(characterName);
        apiData = {
            ...apiData,
            ... await GuildAPIService.getCharacterBasicData(apiData.ocid)
        };
        console.log("apiData:", apiData);

        const guildName = apiData.character_guild_name;
        const worldId = await WorldService.getWordId(apiData.world_name);
        const guildId = await GuildService.getGuildId(guildName, worldId);
        
        await Character.create({
            guild_id: guildId,
            name: characterName,
            ocid: apiData.ocid,
            class: apiData.character_class,
            level: apiData.character_level,
            image: apiData.character_image,
            last_updated: new Date(),
        });
        console.log("캐릭터 정보 추가 성공");

    } catch (error) {
        console.error('에러 발생:', error);
        throw new Error('서버 에러');
    }
}

async function updateCharacter(characterName) {
    try {
        let apiData = await GuildAPIService.getCharacterOcid(characterName);
        apiData = {
            ...apiData,
            ... await GuildAPIService.getCharacterBasicData(apiData.ocid)
        };
        console.log("apiData:", apiData);

        const guildName = apiData.character_guild_name;
        const worldId = await WorldService.getWordId(apiData.world_name);
        const guildId = await GuildService.getGuild(guildName, worldId);
        
        await Character.update({
            guild_id: guildId,
            name: characterName,
            class: apiData.character_class,
            level: apiData.character_level,
            image: apiData.character_image,
            last_updated: new Date(),
        }, { where: { ocid: apiData.ocid } }
        );
        console.log("캐릭터 정보 추가 성공");

    } catch (error) {
        console.error('에러 발생:', error);
        throw new Error('서버 에러');
    }
}

module.exports = {
    createCharacter,
    updateCharacter
}