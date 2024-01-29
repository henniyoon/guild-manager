const { fetchAndSaveMembers } = require('../../services/dataService');

const MainMember = require('../../models/mainMemberModel');
const SubMember = require('../../models/subMemberModel');
const GuildInfo = require('../../models/guildInfoModel');

async function syncMemberList(req, res) {
    try {
        const guildInfoInstance = await GuildInfo.findOne({
            where: {
              id: 1,
            },
          });

        const mainGuildId = guildInfoInstance.main_guild_id;
        const subGuildId = guildInfoInstance.sub_guild_id;

        await fetchAndSaveMembers(mainGuildId, MainMember);
        await fetchAndSaveMembers(subGuildId, SubMember);

        res.status(200).json({ success: true, message: '길드원 동기화 성공'});
    } catch (error) {
        console.error('길드원 동기화 중 에러:', error);
        res.status(500).json({ success: false, message: '길드원 동기화 실패' });
    }
}

module.exports = { 
    syncMemberList,
};