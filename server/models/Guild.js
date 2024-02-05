const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Server = require('./Server.js');

const Guild = sequelize.define('Guild', {
    id: {               // index
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    server_id: {        // 서버 번호 (servers 테이블의 id를 외래키로 사용)
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Server,
            key: 'id',
        },
    },
    name: {             // 길드명
        type: DataTypes.STRING,
        allowNull: false,
    },
    oguild_id: {        // nexon api 사용을 위한 oguild_id
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    last_updated: {     // 최근 갱신일
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'guilds',
    timestamps: false,
    collate: 'utf8mb4_unicode_ci',
    engine: 'InnoDB',
});

module.exports = Guild;