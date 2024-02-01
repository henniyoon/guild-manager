module.exports = (sequelize, DataTypes) => {
    const CharacterInfo = sequelize.define('CharacterInfo', {
      // 모델 속성 정의
      nickname: {
        type: DataTypes.STRING(18),
        allowNull: false
      },
      level: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      URL: {
        type: DataTypes.STRING(255),
      },
      guild: {
        type: DataTypes.STRING(18),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      timestamps: false,
      tableName: 'character_info'
    });
  
    return CharacterInfo;
  };