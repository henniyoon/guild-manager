const { QueryTypes } = require("sequelize");
const sequelize = require("../db");

async function findLimit(req, res) {
    try {
        // 쿼리 실행
        const result = await sequelize.query(
            `
            SELECT name FROM sub_member WHERE main_name IN (SELECT name FROM noblelimit);
        `,
            {
                type: QueryTypes.SELECT,
            }
        );

        // 쿼리 결과 출력
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { findLimit };