const GuildInfo = require('../models/guildInfoModel');

async function guildSettingForm(req, res) {
  res.render('guildSettingForm');
};

async function updateGuildInfo(req, res) {
    try {
        const mainGuildId = req.body.mainGuildId;
        const subGuildId = req.body.subGuildId;

        await GuildInfo.update(
          { main_guild_id: mainGuildId, sub_guild_id: subGuildId },
          { where: { id: 1 } }
          );
        res.status(200).json({ success: true, message: '길드 정보 업데이트 성공'});
  } catch (error) {
    console.error('길드 정보 업데이트 중 에러:', error);
    res.status(500).json({ success: false, message: '길드 정보 업데이트 실패' });
  }
};

module.exports = {
  guildSettingForm,
  updateGuildInfo, 
};