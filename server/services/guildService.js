const Guild = require('../models/Guild.js');
const APIService = require('./apiService.js');
const WorldService = require('./worldService.js');

async function getGuild(guildName, worldName) {
    const worldId = await WorldService.getWorldId(worldName);
    return await Guild.findOne({ where: { name: guildName, world_id: worldId } });
}

async function getGuildId(guildName, worldName) {
    const worldId = await WorldService.getWorldId(worldName);
    const guild = await Guild.findOne({
        where: { name: guildName, world_id: worldId },
        attributes: ["id"],
    });
    return guild ? guild.id : null;
}

async function getGuildById(guildId) {
    return await Guild.findOne({ where: { id: guildId } });
}

// 길드 추가
async function createGuild(guildName, worldName) {
    try {
        const worldId = await WorldService.getWorldId(worldName);
        let apiData = await APIService.getOguildId(guildName, worldName);
        apiData = {
            ...apiData,
            ... await APIService.getGuildBasicData(apiData.oguild_id)
        };

        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);

        const guild = {
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
        };

        await Guild.create(guild);
        console.log("길드 정보 추가 성공");
        // 길드원 목록 return
        return apiData.guild_member;
    } catch (error) {
        console.error('에러 발생:', error);
        throw new Error('서버 에러');
    }
}

// 길드 업데이트
async function updateGuild(guildName, worldName) {
    try {
        const guild = await getGuild(guildName, worldName);
        let apiData = await APIService.getGuildBasicData(guild.oguild_id);

        const apiDate = new Date(apiData.date);
        apiDate.setHours(apiDate.getHours() + 9);

        const updatedGuild = {
            master_name: apiData.guild_master_name,
            member_count: apiData.guild_member_count,
            level: apiData.guild_level,
            noblesse_skill_level: apiData.guild_noblesse_skill.reduce((sum, skill) => sum + skill.skill_level, 0),
            guild_mark: apiData.guild_mark,
            guild_mark_custom: apiData.guild_mark_custom,
            last_updated: apiDate,
        };

        await guild.update(updatedGuild);   // Sequelize의 모델 인스턴스 업데이트 메서드 사용
        console.log("길드 정보 업데이트 성공");

        return apiData.guild_member;
    } catch (error) {
        console.error('에러 발생:', error);
        throw new Error('서버 에러');
    }
}

module.exports = {
    getGuild,
    getGuildId,
    getGuildById,
    createGuild,
    updateGuild,
};