const mariadb = require('mariadb');
const mainCharacterNames = require('./src/guild/characterList.js');
const subCharacterNames = require('./src/guild/characterList.js');

// MariaDB 연결 정보
const pool = mariadb.createPool({
    host: 'localhost',
    port: '3307',
    user: 'root',
    password: '0000',
    database: 'guild_manager',
    connectionLimit: 10, // 동시에 유지될 연결 수
});

// MariaDB 연결 풀에서 연결
pool.getConnection()
    .then((conn) => {
        console.log('Connected to MariaDB');

        // 쿼리 실행 또는 다른 작업 수행
        conn.query('SELECT * FROM main_member')
            .then((rows) => {
                console.log(rows);  // 쿼리 결과 출력
            })
            .catch((err) => {
                console.error('Query error', err);
            })
            .finally(() => {
                // 연결 반환
                conn.release();
                console.log('Connection released');
            });
    })
    .catch((err) => {
        console.error('Connection error', err);
    });