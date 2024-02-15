const Guild = require('../models/Guild.js');
const WorldService = require('./worldService.js');
const APIService = require('./apiService.js');

async function getGuild(guildName, worldId) {
    const guild = await Guild.findOne({ where: { name: guildName, world_id: worldId } });
    return guild;
}

async function getGuildId(guildName, worldId) {
    const guild = await Guild.findOne({ where: { name: guildName, world_id: worldId } });
    return guild ? guild.id : null;
}

async function createGuild(guild, worldName) {
    // 해당 월드의 월드 번호 조회
    const worldId = await WorldService.getWordId(worldName);
    try {
        let apiData = await APIService.getOguildId(guild, worldName);
        apiData = {
            ...apiData,
            ... await APIService.getGuildBasicData(apiData.oguild_id)
        };
        const guildMembers = apiData.guild_member;

        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);
        await Guild.create({
            world_id: worldId,
            name: guild,
            oguild_id: apiData.oguild_id,
            master_name: apiData.guild_master_name,
            member_count: apiData.guild_member_count,
            level: apiData.guild_level,
            noblesse_skill_level: apiData.guild_noblesse_skill.reduce((sum, skill) => sum + skill.skill_level, 0),
            guild_mark: apiData.guild_mark,
            guild_mark_custom: apiData.guild_mark_custom,
            last_updated: apiDate,

        });
        console.log("길드 정보 추가 성공");

        return guildMembers;

    } catch (error) {
        console.error('에러 발생:', error);
        throw new Error('서버 에러');
    }
}

async function updateGuild(guild, worldName) {
    // 해당 월드의 월드 번호 조회
    const worldId = await WorldService.getWordId(worldName);
    try {
        let apiData = await APIService.getOguildId(guild, worldName);
        apiData = {
            ...apiData,
            ... await APIService.getGuildBasicData(apiData.oguild_id)
        };
        const guildMembers = apiData.guild_member;

        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);
        await Guild.update({
            world_id: worldId,
            name: guild,
            master_name: apiData.guild_master_name,
            member_count: apiData.guild_member_count,
            level: apiData.guild_level,
            noblesse_skill_level: apiData.guild_noblesse_skill.reduce((sum, skill) => sum + skill.skill_level, 0),
            guild_mark: apiData.guild_mark,
            guild_mark_custom: apiData.guild_mark_custom,
            last_updated: apiDate,
        },
            { where: { oguild_id: apiData.oguild_id } }
        );
        console.log("길드 정보 업데이트 성공");

        return guildMembers;

    } catch (error) {
        console.error('에러 발생:', error);
        throw new Error('서버 에러');
    }
}

module.exports = {
    getGuild,
    getGuildId,
    createGuild,
    updateGuild,
};