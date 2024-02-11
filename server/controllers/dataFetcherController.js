const WorldService = require('../services/worldService.js');
const GuildService = require('../services/guildService.js');
const CharacterService = require('../services/characterService.js');
const { channel } = require('diagnostics_channel');

async function getGuildController(req, res) {
    const guildName = req.params.guildName;
    const worldName = req.params.worldName;
    try {
        const wolrdId = await WorldService.getWordId(worldName);
        const guild = await GuildService.getGuild(guildName, wolrdId);

        if (guild) {
            const response = guild.map(record => ({
                ...record.toJSON(),
            }));

            res.json(response);
        }
    } catch (error) {
        console.error('에러 발생: ', error);
        res.status(500).send('서버 에러');
    }
}

async function dataFetcherController(req, res) {
    const guildName = req.params.guildName;
    const worldName = req.params.worldName;
    console.log("guildName: ", guildName);
    console.log("worldName: ", worldName);
    try {
        const wolrdId = await WorldService.getWordId(worldName);
        const guildExists = await GuildService.getGuild(guildName, wolrdId);
        console.log("guildExists: ", guildExists);

        if (!guildExists) {
            // Guild가 존재하지 않으면 생성
            await GuildService.createGuild(guildName, worldName);
            res.status(201).send('길드 정보 추가 성공');

        } else {
            const currentDate = new Date();
            // currentDate.setDate(currentDate.getDate() - 1);
            // currentDate.setHours(currentDate.getHours() + 9);
            // UTC 시간을 현재 시간대로 변환
            const localTime = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
            localTime.setHours(0, 0, 0, 0);

            console.log("localTime:", localTime);

            if (guildExists.last_updated < currentDate) {
                await GuildService.updateGuild(guildName, worldName);
                res.status(200).send('길드 정보 업데이트 성공');
            } else {
                res.status(200).send('이미 최신 정보입니다.');
            }
        }
    } catch (error) {
        console.error('에러 발생: ', error);
        res.status(500).send('서버 에러');
    }
}

module.exports = {
    getGuildController,
    dataFetcherController,
}