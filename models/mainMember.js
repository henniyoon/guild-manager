const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

// 본캐릭 길드 테이블 정의
const MainMember = sequelize.define('MainMember', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // 중복되지 않도록 설정
    },
}, {
    tableName: 'main_member', // 실제 테이블 이름
    freezeTableName: true, // 테이블 이름 고정
    timestamps: false, // createdAt 및 updatedAt 필드 생성 안 함
});

module.exports = MainMember;