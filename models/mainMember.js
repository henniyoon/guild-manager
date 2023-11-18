const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: 'localhost',
    port: '3307',
    username: 'root',
    password: '0000',
    database: 'guild_manager',
});

const MainMember = sequelize.define('MainMember', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'main_member', // 실제 테이블 이름
    freezeTableName: true, // 테이블 이름 고정
    primaryKey: false, // 자동 생성되는 기본 키 사용 안 함
});

module.exports = MainMember;
