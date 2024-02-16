const Guild = require('../models/Guild.js');
const APIService = require('./apiService.js');
const WorldService = require('./worldService.js');

async function getGuild(guildName, worldName) {
    const worldId = await WorldService.getWorldId(worldName);
    const guild = await Guild.findOne({ where: { name: guildName, world_id: worldId } });
    return guild;
}

async function getGuildId(guildName, worldName) {
    const worldId = await WorldService.getWorldId(worldName);
    const guild = await Guild.findOne({ where: { name: guildName, world_id: worldId } });
    return guild ? guild.id : null;
}

async function createGuild(guildName, worldName) {
    const worldId = await WorldService.getWorldId(worldName);
    try {
        let apiData = await APIService.getOguildId(guildName, worldName);
        apiData = {
            ...apiData,
            ... await APIService.getGuildBasicData(apiData.oguild_id)
        };
        const guildMembers = apiData.guild_member;

        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);
        await Guild.create({
            world_id: worldId,
            name: guildName,
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

async function updateGuild(guildName, worldName) {
    const worldId = await WorldService.getWorldId(worldName);
    try {
        let apiData = await APIService.getOguildId(guildName, worldName);
        apiData = {
            ...apiData,
            ... await APIService.getGuildBasicData(apiData.oguild_id)
        };
        const guildMembers = apiData.guild_member;
        console.log("apiData:", apiData);

        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);
        await Guild.update({
            world_id: worldId,
            name: guildName,
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