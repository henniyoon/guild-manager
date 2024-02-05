// guilds.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./database'); // 데이터베이스 연결 설정을 포함한 sequelize 인스턴스를 불러옵니다.

class Guild extends Model {}

Guild.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  server_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // server_id에 대한 인덱스 설정은 모델 정의에 직접 포함되지 않습니다.
    // Sequelize 마이그레이션을 사용하여 별도로 설정할 수 있습니다.
  },
  guild_name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  oguild_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '',
    unique: true // oguild_id가 유니크 인덱스로 설정됨
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null
  }
}, {
  sequelize, // sequelize 인스턴스
  modelName: 'Guild', // 모델 이름
  tableName: 'guilds', // 테이블 이름
  timestamps: false, // createdAt과 updatedAt 타임스탬프를 사용하지 않음
  charset: 'utf8mb4', // 테이블의 charset 설정
  collate: 'utf8mb4_unicode_ci' // 테이블의 collate 설정
});

module.exports = Guild;
