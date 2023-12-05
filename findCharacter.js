const sequelize = require('./db');

async function findCharacter() {
  try {
    const result = await sequelize.query(
      'SELECT * FROM sub_member WHERE name IN (SELECT name FROM restriction)',
      { type: sequelize.QueryTypes.SELECT }
    );

    return result;
  } catch (error) {
    throw error;
  }
}

// Sequelize 객체와 fetchDataFromDatabase 함수를 함께 내보내기
module.exports = { sequelize, findCharacter };
