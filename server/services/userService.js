const User = require('../models/User.js');
const APIService = require('./apiService.js');
const GuildService = require('./guildService.js');
const characterService = require('./characterService.js');

async function setUserRole(apikey, id, guildName, worldName) {
    const verify = await verifyAdmin(apikey, guildName, worldName);
    if (verify) {
        await User.update({
            role: "Master"
        },
            { where: { id: id } }
        );
    } else {
        console.log("인증 실패");
    }
}

async function verifyAdmin(apiKey, guildName, worldName) {
    try {
        const userCharacters = await APIService.getHistoryCharacterNames(apiKey);
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
        console.error('에러 발생:', error);
    }
}

module.exports = {
    setUserRole,
    verifyAdmin,
}

setUserRole("test_51a72486d6ea2528359dd65ac6d066018a9039af4e0529bd0432f26e4744123a05f0445e41873440742bb6f5e750d93f", 1, "별빛", "스카니아");
// verifyAdmin("live_8889de2bcdbf2ffc389f01c608c335ad8feab2cc9b5a30e4551a599f1f9956847c78d2cca2b6f310be5c3009a02cd2b3", "초깜찍", "스카니아");