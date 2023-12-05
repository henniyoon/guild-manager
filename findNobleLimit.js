const sequelize = require('./db');

async function findNobleLimit() {
  try {
    const result = await sequelize.query(
      'SELECT * FROM sub_member WHERE name IN (SELECT name FROM NobleLimit)',
      { type: sequelize.QueryTypes.SELECT }
    );

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = { sequelize, findNobleLimit };
