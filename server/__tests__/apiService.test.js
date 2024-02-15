const {
    getOguildId, 
    getGuildBasicData, 
    getCharacterOcid, 
    getCharacterBasicData, 
    getMainCharacterName 
} = require('../services/apiService.js');


test('getMainCharacterName Test', async () => {
    const mainCharacterName = await getMainCharacterName('스카니아', 'bff1b13291a2d97cc0b7a988cd3095d6');
    expect(mainCharacterName).toBeDefined();
  });