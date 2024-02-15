const {
    getOguildId,
    getGuildBasicData,
    getCharacterOcid,
    getCharacterBasicData,
    getMainCharacterName
} = require('../../services/apiService.js');


test('OguildId 조회', async () => {
    const oguildId = await getOguildId('별빛', '스카니아');
    expect(oguildId).toBeDefined();
    // console.log("oguildId:", oguildId);
})

test('길드 정보 조회', async () => {
    const guildData = await getGuildBasicData('bf630c2b4f0ebbc873e6d51bd842fe8b');
    expect(guildData).toBeDefined();
    // console.log("guildData:", guildData);
})

test('Ocid 조회', async () => {
    const ocid = await getCharacterOcid('헨아');
    expect(ocid).toBeDefined();
    // console.log("ocid:", ocid);
})

test('캐릭터 정보 조회', async () => {
    const characterData = await getCharacterBasicData('bff1b13291a2d97cc0b7a988cd3095d6');
    expect(characterData).toBeDefined();
    console.log("characterData:", characterData);
})

test('본캐명 조회', async () => {
    const mainCharacterName = await getMainCharacterName('스카니아', 'bff1b13291a2d97cc0b7a988cd3095d6');
    expect(mainCharacterName).toBeDefined();
    console.log("mainCharacterName:", mainCharacterName);
})