const {
    getCharacter,
    getCharactersByGuild,
    createCharacter,
    updateCharacter,
} = require('../../services/characterService.js');

test('DB에서 캐릭터 조회', async () => {
    const character = await getCharacter('헨쁘');
    expect(character).toBeDefined();
    // console.log("character:", character);
})

test('DB에서 특정 길드의 길드원 조회', async () => {
    const memberList = await getCharactersByGuild('별빛', '스카니아');
    expect(memberList).toBeDefined();
    // console.log("memberList:", memberList);
})

// test('DB에 캐릭터 추가', async () => {
//     const newCharacter = await createCharacter('별밤', '스카니아', '최애의헨쁘');
//     expect(newCharacter).toBeDefined();
//     // console.log("newCharacter:", newCharacter);
// })

test('DB의 캐릭터 업데이트', async () => {
    const updateCha = await updateCharacter('별빛', '스카니아', '헨쁘');
    expect(updateCha).toBeDefined();
    console.log("updateCha:", updateCha);
})