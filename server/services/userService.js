const User = require('../models/User.js');
const APIService = require('./apiService.js');
const GuildService = require('./guildService.js');
const characterService = require('./characterService.js');

async function getUser(id) {
    const user = await User.findOne({ where: { id: id } });
    if (user) {
        const { username, email, guild_id, role } = user;
        return { username, email, guild_id, role };
    }
    return null;
}

async function verifyAdmin(apiKey, historyType, guildName, worldName) {
    try {
        const userCharacters = await APIService.getHistoryCharacterNames(apiKey, historyType);
        const character = await characterService.getCharacter(userCharacters);
        const mainCharacter = character.main_character_name;

        const guild = await GuildService.getGuild(guildName, worldName);
        const guildMaster = guild.master_name;
        const guildMastersMainCharacter = await characterService.getCharacter(guildMaster);
        const guildMastersMainCharacterName = guildMastersMainCharacter.main_character_name;

        if (mainCharacter == guildMastersMainCharacterName) {
            console.log("인증 성공");
            return true;
        } else {
            console.log("인증 실패");
            return false;
        }
    } catch (error) {
        console.log("서버 에러");
        return false;
    }
}

async function setUserRoleMaster(apikey, historyType, id, guildName, worldName) {
    const guildId = await GuildService.getGuildId(guildName, worldName);
    const verify = await verifyAdmin(apikey, historyType, guildName, worldName);
    if (verify) {
        await User.update({
            guild_id: guildId,
            role: "마스터",
        },
            { where: { id: id } }
        );
        console.log("마스터 권한 부여");
        return { success: true };
    } else {
        console.log("권한 부여 실패");
        return { success: false };
    }
}

async function setUserRoleSubMaster(id, guildName, worldName) {
    const guildId = await GuildService.getGuildId(guildName, worldName);
    try {
        await User.update({
            guild_id: guildId,
            role: "부마스터",
        },
            { where: { email: id } }
        );
        console.log("부마스터 권한 부여");
        return { success: true };

    } catch (error) {
        console.log("권한 부여 실패");
        return { success: false };
    }
}

module.exports = {
    getUser,
    verifyAdmin,
    setUserRoleMaster,
    setUserRoleSubMaster,
}