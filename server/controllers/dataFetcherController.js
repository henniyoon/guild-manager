const WorldService = require('../services/worldService.js');
const GuildService = require('../services/guildService.js');
const CharacterService = require('../services/characterService.js');

async function getGuildController(req, res) {
    const guildName = req.params.guildName;
    const worldName = req.params.worldName;
    try {
        const wolrdId = await WorldService.getWordId(worldName);
        const guild = await GuildService.getGuild(guildName, wolrdId);

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
        const wolrdId = await WorldService.getWordId(worldName);
        const guildExists = await GuildService.getGuild(guildName, wolrdId);

        if (!guildExists) {
            // Guild가 존재하지 않으면 생성
            const guildMembers = await GuildService.createGuild(guildName, worldName);
            for (const guildMember of guildMembers) {
                await CharacterService.createCharacter(guildName, worldName, guildMember);
            };
            res.status(201).send('길드 정보 추가 성공');

        } else {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            currentDate.setDate(currentDate.getDate() - 1);
            currentDate.setHours(currentDate.getHours() + 9);

            if (guildExists.last_updated < currentDate) {
                const guildMembers = await GuildService.updateGuild(guildName, worldName);
                for (const guildMember of guildMembers) {
                    const guildMemberExists = await CharacterService.getCharacter(guildMember);
                    // console.log("guildMEmberExists", guildMemberExists);
                    if (!guildMemberExists) {
                        await CharacterService.createCharacter(guildName, worldName, guildMember);
                    } else {
                        await CharacterService.updateCharacter(guildName, worldName, guildMember);
                    }
                };
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
    getCharacterController,
    dataFetcherController,
}