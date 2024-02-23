const WorldService = require('./worldService.js');
const GuildService = require('./guildService.js');
const CharacterService = require('./characterService.js');

function findNewAndRemovedMembers(preGuildMembers, updatedGuildMembers) {
    const newMembers = updatedGuildMembers.filter(member => !preGuildMembers.includes(member));
    const removedMembers = preGuildMembers.filter(member => !updatedGuildMembers.includes(member));

    return { newMembers, removedMembers };
}

async function createOrUpdateGuildPage(guildName, worldName) {

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() - 1);
    currentDate.setHours(currentDate.getHours() + 8);

    // const worldId = await WorldService.getWorldId(worldName);
    const guildExists = await GuildService.getGuild(guildName, worldName);

    if (!guildExists) {
        const guildMembers = await GuildService.createGuild(guildName, worldName);
        for (const guildMember of guildMembers) {
            await CharacterService.createCharacter(guildName, worldName, guildMember);
        }

    } else if (guildExists.last_updated < currentDate) {
        const preGuildMembers = await CharacterService.getCharactersByGuild(guildName, worldName);
        const preGuildMemberNames = preGuildMembers.map(member => member.name);
        // 길드 정보 업데이트
        const guildMembers = await GuildService.updateGuild(guildName, worldName);
        // 신규 가입자, 탈퇴자 조회
        const { newMembers, removedMembers } = findNewAndRemovedMembers(preGuildMemberNames, guildMembers);

        for (const guildMember of guildMembers) {
            const characterExist = await CharacterService.getCharacter(guildMember);

            if (!characterExist) {
                await CharacterService.createCharacter(guildName, worldName, guildMember);
            } else {
                await CharacterService.updateCharacter(guildMember);
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