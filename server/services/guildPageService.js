const APIService = require('./apiService.js');
const ScrapingService = require('./scrapingService.js');
const GuildService = require('./guildService.js');
const CharacterService = require('./characterService.js');

function findNewAndRemovedMembers(preGuildMembers, updatedGuildMembers) {
    const newMembers = updatedGuildMembers.filter(member => !preGuildMembers.includes(member));
    const removedMembers = preGuildMembers.filter(member => !updatedGuildMembers.includes(member));

    return { newMembers, removedMembers };
}

async function createOrUpdateGuildPage(guildName, worldName) {
    const apiDate = new Date(APIService.apiDate());
    const guildExists = await GuildService.getGuild(guildName, worldName);
    console.log("guildExists.master_name", guildExists.master_name);
    const subMasterNames = await ScrapingService.scrapeSubMaster(worldName, guildName);
    console.log("subMasterNamse: ", subMasterNames);
    let guildRole = '';

    if (!guildExists) {
        const guildMembers = await GuildService.createGuild(guildName, worldName);
        for (const guildMember of guildMembers) {
            if (guildExists && guildExists.master_name === guildMember) {     // 길드 마스터 여부 확인
                guildRole = '마스터';
            } else if (subMasterNames.includes(guildMember)) {    // 길드 부마스터 여부 확인
                guildRole = '부마스터';
            } else {
                guildRole = '길드원';
            }
            await CharacterService.createCharacter(guildName, worldName, guildMember, guildRole);
        }
    } else if (guildExists.last_updated < apiDate) {
        const preGuildMembers = await CharacterService.getCharactersByGuild(guildName, worldName);
        const preGuildMemberNames = preGuildMembers.map(member => member.name);
        // 길드 정보 업데이트
        const guildMembers = await GuildService.updateGuild(guildName, worldName);
        // 신규 가입자, 탈퇴자 조회
        const { newMembers, removedMembers } = findNewAndRemovedMembers(preGuildMemberNames, guildMembers);

        for (const guildMember of guildMembers) {
            const characterExist = await CharacterService.getCharacter(guildMember);

            if (guildExists && guildExists.master_name === guildMember) {     // 길드 마스터 여부 확인
                guildRole = '마스터';
            } else if (subMasterNames.includes(guildMember)) {    // 길드 부마스터 여부 확인
                guildRole = '부마스터';
            } else {
                guildRole = '길드원';
            }
            console.log("guildRole: ", guildRole);
            if (!characterExist) {
                await CharacterService.createCharacter(guildName, worldName, guildMember, guildRole);
            } else {
                await CharacterService.updateCharacter(guildMember, guildRole);
            }
        }
        if (removedMembers) {
            for (const removedMember of removedMembers) {
                await CharacterService.removeGuildCharacter(removedMember);
            }
        }
    }
}

module.exports = {
    createOrUpdateGuildPage,
}