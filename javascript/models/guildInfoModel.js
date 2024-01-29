const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// 길드 정보 테이블 정의
const GuildInfo = sequelize.define('GuildInfo', {
    main_guild_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false, // 중복되지 않도록 설정
    },
    sub_guild_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false, // 중복되지 않도록 설정
    },
}, {
    tableName: 'guild_info', // 실제 테이블 이름
    freezeTableName: true, // 테이블 이름 고정
    timestamps: false, // createdAt 및 updatedAt 필드 생성 안 함
});

module.exports = GuildInfo;