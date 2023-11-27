const { DataTypes } = require('sequelize');
const { sequelize } = require('./mainMember'); // mainMember 모델에서 sequelize 객체를 가져옴

// 부캐릭 길드 테이블 정의
const SubMember = sequelize.define('SubMember', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    main_name: {
        // 본캐릭 이름 (main_member 외래키 설정)
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'main_member',
            key: 'name',
        },
    },
}, {
    tableName: 'sub_member',
    freezeTableName: true,
    timestamps: false,
});

module.exports = { SubMember, sequelize };
