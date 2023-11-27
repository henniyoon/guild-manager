const { Sequelize } = require('sequelize');

// MariaDB 연결 정보
const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: 'localhost',
    port: '3307',
    username: 'root',
    password: '0000',
    database: 'guild_manager',
});

// 배열의 각 요소를 데이터베이스에 저장
async function saveMember(characterNames) {
    let conn;

    try {
        conn = await pool.getConnection();

        for (const name of characterNames) {
            await conn.query('INSERT INTO main_member (name) VALUES (?) ', [name]);
        }

        console.log('별빛 길드원 저장 성공');
    } catch (err) {
        console.error('데이터 저장 에러', err);
    } finally {
        if (conn) {
            conn.release(); // 연결 반환!
        }
    }
}

module.exports = { saveMember, sequelize };
