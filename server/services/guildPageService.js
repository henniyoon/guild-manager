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
        const members = [...guildMembers, ...removedMembers];
        
        await Promise.all(members.map(async (member) => {
            const character = await APIService.getCharacterOcid(member);
            const characterOcidExist = await CharacterService.getCharacterByOcid(character.ocid);
            const characterExist = await CharacterService.getCharacter(member);

            guildRole = (guildExists && guildExists.master_name === member)
                ? '마스터'
                : (subMasterNames.includes(member) ? '부마스터' : '길드원');

            if (characterExist) {
                await CharacterService.updateCharacter(member, guildRole);
            } else if (characterOcidExist) {
                await CharacterService.updateCharacterName(character.ocid);
            } else {
                await CharacterService.createCharacter(guildName, worldName, member, guildRole);
            }
        }));
    }
}

module.exports = {
    createOrUpdateGuildPage,
};