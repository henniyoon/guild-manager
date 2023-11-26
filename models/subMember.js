const { Sequelize, DataTypes } = require('sequelize');
const MainMember = require('./mainMember'); // mainMember 모델을 불러옴

const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: 'localhost',
    port: '3307',
    username: 'root',
    password: '0000',
    database: 'guild_manager',
});

const SubMember = sequelize.define('SubMember', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // 중복되지 않도록 설정
    },
    main_name: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: MainMember.MainMember, // mainMember 모델을 참조
            key: 'name', // mainMember 테이블의 어떤 컬럼을 외래키로 사용할 것인지 설정
        },
    },
}, {
    tableName: 'sub_member', // 실제 테이블 이름
    freezeTableName: true, // 테이블 이름 고정
    timestamps: false, // createdAt 및 updatedAt 필드 생성 안 함
});

module.exports = SubMember;
