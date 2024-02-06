const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Characters = require('./Character.js');

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
        references: {
            model: Characters,
            key: 'id',
        },
    },
    weekly_score: {     // 주간 점수
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    suro_score: {       // 수로 점수
        type: DataTypes.MEDIUMINT,
        allowNull: true,
    },  
    flag_score: {       // 플래그 점수
        type: DataTypes.SMALLINT,
        allowNull: true,
    },
    noble_limit: {      // 노블 제한 여부
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    week: {       // 작성일
        type: DataTypes.STRING(8),
        allowNull: false,
    },
}, {
    tableName: 'records',
    timestamps: false,
    collate: 'utf8mb4_unicode_ci',
    engine: 'InnoDB',
});

Record.belongsTo(Characters, {foreignKey: 'character_id', as: 'character'});

module.exports = Record;