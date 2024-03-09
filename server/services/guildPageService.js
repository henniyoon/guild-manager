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
    const subMasterNames = await ScrapingService.scrapeSubMaster(worldName, guildName);
    
    let guildRole = '';

    if (!guildExists) {
        const guildMembers = await GuildService.createGuild(guildName, worldName);

        await Promise.all(guildMembers.map(async (guildMember) => {
            guildRole = (guildExists && guildExists.master_name === guildMember)
                ? '마스터'
                : (subMasterNames.includes(guildMember) ? '부마스터' : '길드원');

            await CharacterService.createCharacter(guildName, worldName, guildMember, guildRole);
        }));
    } else if (guildExists.last_updated < apiDate) {
        const preGuildMembers = await CharacterService.getCharactersByGuild(guildName, worldName);
        const preGuildMemberNames = preGuildMembers.map(member => member.name);

        // 길드 정보 업데이트
        const guildMembers = await GuildService.updateGuild(guildName, worldName);

        // 신규 가입자, 탈퇴자 조회
        const { newMembers, removedMembers } = findNewAndRemovedMembers(preGuildMemberNames, guildMembers);

        await Promise.all(guildMembers.map(async (guildMember) => {
            const characterExist = await CharacterService.getCharacter(guildMember);

            guildRole = (guildExists && guildExists.master_name === guildMember)
                ? '마스터'
                : (subMasterNames.includes(guildMember) ? '부마스터' : '길드원');

            console.log("guildRole: ", guildRole);

            if (!characterExist) {
                await CharacterService.createCharacter(guildName, worldName, guildMember, guildRole);
            } else {
                await CharacterService.updateCharacter(guildMember, guildRole);
            }
        }));

        if (removedMembers) {
            await Promise.all(removedMembers.map(async (removedMember) => {
                await CharacterService.removeGuildCharacter(removedMember);
            }));
        }
    }
}

module.exports = {
    createOrUpdateGuildPage,
};