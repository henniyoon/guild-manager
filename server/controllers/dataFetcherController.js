const GuildService = require('../services/guildService.js');
const CharacterService = require('../services/characterService.js');
const GuildPageService = require('../services/guildPageService.js');

async function getGuildController(req, res) {
    const guildName = req.params.guildName;
    const worldName = req.params.worldName;
    try {
        const guild = await GuildService.getGuild(guildName, worldName);

        if (guild) {
            res.json(guild);
        } else {
            res.status(404).json({ error: '존재하지 않는 길드' });
        }
    } catch (error) {
        console.error('에러 발생: ', error);
        res.status(500).send('서버 에러');
    }
}

async function getCharacterController(req, res) {
    const guildName = req.params.guildName;
    const worldName = req.params.worldName;
    try {
        const characters = await CharacterService.getCharactersByGuild(guildName, worldName);

        if (characters) {
            const response = characters.map(record => ({
                ...record.toJSON(),
            }));
            res.json(response);
        } else {
            res.status(404).json({ error: '존재하지 않는 캐릭터' });
        }
    } catch (error) {
        console.error('에러 발생: ', error);
        res.status(500).send('서버 에러');
    }
}

async function dataFetcherController(req, res) {
    const guildName = req.params.guildName;
    const worldName = req.params.worldName;

    try {
        await GuildPageService.createOrUpdateGuildPage(guildName, worldName);
        res.status(200).send('데이터 업데이트 성공');
    } catch (error) {
        console.error('에러 발생:', error);
        res.status(500).send('서버 에러');
    }
}

module.exports = {
    getGuildController,
    getCharacterController,
    dataFetcherController,
}