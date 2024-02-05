// servers.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./database'); // 데이터베이스 연결 설정을 포함한 sequelize 인스턴스를 불러옵니다.

class Server extends Model {}

Server.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(16),
    allowNull: false,
    defaultValue: '',
    unique: true // name 필드에 대한 유니크 인덱스 설정
  }
}, {
  sequelize, // sequelize 인스턴스
  modelName: 'Server', // 모델 이름
  tableName: 'servers', // 테이블 이름
  timestamps: false, // createdAt과 updatedAt 타임스탬프를 사용하지 않음
  charset: 'utf8mb4', // 테이블의 charset 설정
  collate: 'utf8mb4_unicode_ci' // 테이블의 collate 설정
});

module.exports = Server;
