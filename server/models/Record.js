const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Characters = require('./Characters.js');

const Record = sequelize.define('Record', {
    id: {               // index
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    character_id: {     // 캐릭터 번호 (characters 테이블의 id)
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
        references: {
            model: Characters,
            key: 'id',
        },
    },
    weekly_score: {     // 주간 점수
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    suro_score: {       // 수로 점수
        type: DataTypes.INTEGER,
        allowNull: true,
    },  
    flag_score: {       // 플래그 점수
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    noble_limit: {      // 노블 제한 여부
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    created_at: {       // 작성일
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'records',
    timestamps: false,
    collate: 'utf8mb4_unicode_ci',
    engine: 'InnoDB',
});

module.exports = Record;