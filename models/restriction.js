const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const restriction = sequelize.define('restriction', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    createdAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
}, {
    tableName: 'restriction', // 실제 테이블 이름
    freezeTableName: true, // 테이블 이름 고정
    timestamps: true,
});

module.exports = restriction;