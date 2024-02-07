const Guild = require('../models/Guild.js');
const Character = require('../models/Character.js');
const WorldService = require('./worldService.js');
const GuildAPIService = require('./guildApiService.js');

async function updateGuildData(guild, worldName) {
    // 해당 월드의 월드 번호 조회
    const worldId = await WorldService.getWordId(worldName);
    // 해당 길드의 DB 존재 여부 확인
    const guildExists = await Guild.findOne({ where: { name: guild, world_id: worldId } });

    try {
        // 길드가 DB에 존재하지 않으면
        if (!guildExists) {
            let apiData = await GuildAPIService.getOguildId(guild, worldName);
            apiData = {
                ...apiData,
                ... await GuildAPIService.getGuildBasicData(apiData.oguild_id)
            };

            console.log("apiData:", apiData);

            await Guild.findOrCreate({
                where: { oguild_id: apiData.oguild_id },
                defaults: {
                    world_id: worldId,
                    name: guild,
                    oguild_id: apiData.oguild_id,
                    master_name: apiData.guild_master_name,
                    member_count: apiData.guild_member_count,
                    level: apiData.guild_level,
                    noblesse_skill_level: apiData.guild_noblesse_skill.reduce((sum, skill) => sum + skill.skill_level, 0),
                    guild_mark: apiData.guild_mark,
                    guild_mark_custom: apiData.guild_mark_custom,
                    last_updated: new Date(),
                }
            })
        } else {
            await Guild.findOne({
                where: { oguild_id: guildExists.oguild_id }
            });
        }
    } catch (error) {
        console.error('에러 발생:', error);
        throw new Error('서버 에러');
    }
}

module.exports = {
    updateGuildData,
};