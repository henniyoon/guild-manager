const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Guild = require('./Guild.js');
const World = require('./World.js');

const Character = sequelize.define('Characters', {
  id: {         // index
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  world_id: {       // 월드 번호 (worlds 테이블의 id를 외래키로 사용)
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: World,
      key: 'id',
    },
  },
  guild_id: {       // 길드 번호 (guilds 테이블의 id를 외래키로 사용)
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Guild,
      key: 'id',
    },
  },
  guild_role: {     // 길드 직위
    type: DataTypes.STRING(12),
    allowNull: false,
    defaultValue: '길드원',
  },
  name: {           // 캐릭터명  
    type: DataTypes.STRING(12),
    allowNull: true,
  },
  ocid: {           // nexon api 사용을 위한 ocid 
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  class: {          // 직업
    type: DataTypes.STRING(18),
    allowNull: true,
  },
  level: {          // 캐릭터 레벨
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: true,
  },
  main_character_name: {  // 본캐릭명
    type: DataTypes.STRING(12),
    allowNull: true,
  },
  image: {          // 캐릭터 외형 이미지
    type: DataTypes.STRING(511),
    allowNull: true,
  },
  last_updated: {   // 최근 갱신일
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'characters',
  timestamps: false, // 만약 테이블에 createdAt 및 updatedAt 컬럼을 추가하고 싶지 않다면 false로 설정
  collate: 'utf8mb4_unicode_ci',
  engine: 'InnoDB',
});

module.exports = Character;
