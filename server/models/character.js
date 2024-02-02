// character.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./database'); // 데이터베이스 연결 설정을 포함한 sequelize 인스턴스를 불러옵니다.

class Character extends Model {}

Character.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  guildId: {
    type: DataTypes.STRING(18),
    allowNull: true,
    defaultValue: null
  },
  nickname: {
    type: DataTypes.STRING(18),
    allowNull: true,
    defaultValue: null
  },
  level: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: true,
    defaultValue: null
  },
  URL: {
    type: DataTypes.STRING(511),
    allowNull: true,
    defaultValue: null
  },
  ouser_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  updated_at: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null
  }
}, {
  sequelize, // sequelize 인스턴스
  modelName: 'Character', // 모델 이름
  tableName: 'character_info', // 테이블 이름
  timestamps: false, // createdAt과 updatedAt 타임스탬프를 사용하지 않음
  charset: 'utf8mb4', // 테이블의 charset 설정
  collate: 'utf8mb4_unicode_ci' // 테이블의 collate 설정
});

module.exports = Character;
