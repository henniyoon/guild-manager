// record.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./database'); // 데이터베이스 연결 설정을 포함한 sequelize 인스턴스를 불러옵니다.
const Character = require('./character'); // character 모델을 불러옵니다.

class Record extends Model {}

Record.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  character_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    references: {
      model: Character, // 참조하는 모델
      key: 'id', // 참조하는 모델의 컬럼
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  weekly_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  suro_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  flag_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  noble_limit: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
    defaultValue: null
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Record',
  tableName: 'record',
  timestamps: false, // createdAt과 updatedAt 타임스탬프를 사용하지 않음
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// 외래 키 관계 설정
Character.hasMany(Record, { foreignKey: 'character_id' });
Record.belongsTo(Character, { foreignKey: 'character_id' });

module.exports = Record;
