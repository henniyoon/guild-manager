const { Sequelize, DataTypes } = require('sequelize');

// MariaDB 연결 정보
const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: 'localhost',
    port: '3307',
    username: 'root',
    password: '0000',
    database: 'guild_manager',
});

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

// 부캐릭 길드 테이블 정의
const SubMember = sequelize.define('SubMember', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    main_name: {    // 본캐릭 이름 (main_member 외래키 설정)
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'main_members',
            key: 'name',
        },
    },
}, {
    tableName: 'sub_member',
    freezeTableName: true,
    timestamps: false,
});


module.exports = { MainMember, SubMember, sequelize };
