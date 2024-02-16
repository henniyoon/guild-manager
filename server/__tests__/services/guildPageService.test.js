const GuildPageService = require('../../services/guildPageService.js');
const GuildService = require('../../services/guildService.js');
const CharacterService = require('../../services/characterService.js');

jest.mock('../../services/guildService.js');
jest.mock('../../services/characterService.js');

describe('GuildPageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createOrUpdateGuildPage - 길드가 존재하지 않을 때', async () => {
    GuildService.getGuild.mockResolvedValueOnce(null);
    GuildService.createGuild.mockResolvedValueOnce(['member1', 'member2']);
    CharacterService.createCharacter.mockResolvedValueOnce();

    await GuildPageService.createOrUpdateGuildPage('guildName', 'worldName');

    expect(GuildService.getGuild).toHaveBeenCalledWith('guildName', 'worldName');
    expect(GuildService.createGuild).toHaveBeenCalledWith('guildName', 'worldName');
    expect(CharacterService.createCharacter).toHaveBeenCalledTimes(2);
  });

//   test('createOrUpdateGuildPage - 길드가 존재하고, 업데이트가 필요할 때', async () => {
//     GuildService.getGuild.mockResolvedValueOnce({
//       last_updated: '2024-01-01',
//     });
//     GuildService.updateGuild.mockResolvedValueOnce(['updatedMember']);
//     CharacterService.getCharactersByGuild.mockResolvedValueOnce(['oldMember']);
//     CharacterService.getCharacter.mockResolvedValueOnce(null);
//     CharacterService.createCharacter.mockResolvedValueOnce();

//     await GuildPageService.createOrUpdateGuildPage('guildName', 'worldName');

//     expect(GuildService.getGuild).toHaveBeenCalledWith('guildName', 'worldName');
//     expect(GuildService.updateGuild).toHaveBeenCalledWith('guildName', 'worldName');
//     expect(CharacterService.getCharactersByGuild).toHaveBeenCalledWith('guildName', 'worldName');
//     expect(CharacterService.getCharacter).toHaveBeenCalledWith('updatedMember');
//     expect(CharacterService.createCharacter).toHaveBeenCalledWith('guildName', 'worldName', 'updatedMember');
//     expect(CharacterService.updateCharacter).not.toHaveBeenCalled();
//   });

  test('createOrUpdateGuildPage - 길드가 존재하고 업데이트가 필요하지 않을 때', async () => {
    const currentDate = new Date();
    GuildService.getGuild.mockResolvedValueOnce({
      last_updated: currentDate.toISOString(),
    });

    await GuildPageService.createOrUpdateGuildPage('guildName', 'worldName');

    expect(GuildService.getGuild).toHaveBeenCalledWith('guildName', 'worldName');
    expect(GuildService.updateGuild).not.toHaveBeenCalled();
    expect(CharacterService.getCharactersByGuild).not.toHaveBeenCalled();
    expect(CharacterService.getCharacter).not.toHaveBeenCalled();
    expect(CharacterService.createCharacter).not.toHaveBeenCalled();
    expect(CharacterService.updateCharacter).not.toHaveBeenCalled();
  });
});
