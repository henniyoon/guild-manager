const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Guild = require('./Guild.js');

const User = sequelize.define('User', {
  id: {           // index
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  guild_id: {     // 길드 번호 (guilds 테이블의 id를 외래키로 사용)
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Guild,
      key: 'id',
    },
  },
  username: {     // 사이트 닉네임
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {        // 로그인 용 email
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {     // 로그인용 password
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {         // 길드 직위
    type: DataTypes.ENUM('마스터', '부마스터', '길드원'),
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: false,
  collate: 'utf8mb4_unicode_ci',
  engine: 'InnoDB',
});

module.exports = User;