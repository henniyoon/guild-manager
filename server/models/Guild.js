const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const World = require('./World.js');

const Guild = sequelize.define('Guild', {
    id: {               // index
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    world_id: {        // 월드 번호 (worlds 테이블의 id를 외래키로 사용)
        type: DataTypes.TINYINT,
        allowNull: false,
        references: {
            model: World,
            key: 'id',
        },
    },
    name: {             // 길드명
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    oguild_id: {        // nexon api 사용을 위한 oguild_id
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    master_name: {      // 길드 마스터 닉네임
        type: DataTypes.STRING(12),
        allowNull: true,    
    },
    member_count: {     // 길드원 수
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    level: {            // 길드 레벨
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    noblesse_skill_level: {     // 길드 노블 포인트
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    guild_mark: {               // 기본 길드 마크
       type: DataTypes.STRING,
       allowNull: true, 
    },
    guild_mark_custom: {        // 커스텀 길드 마크
        type: DataTypes.BLOB,
        allowNull: true, 
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
    // hooks: {
    //     // 모델이 저장될 때마다 호출되는 hook
    //     beforeSave: (instance, options) => {
    //         // last_updated를 현재 한국 시간으로 업데이트
    //         instance.last_updated = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
    //     },
    // },
});

module.exports = Guild;