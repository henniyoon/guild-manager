module.exports = (sequelize, DataTypes) => {
    const Guild = sequelize.define('Guild', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      server_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'servers', // `servers` 모델을 참조합니다. 실제 모델 이름이나 테이블 이름에 따라 다를 수 있습니다.
          key: 'id'
        }
      },
      guild_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        collate: 'utf8mb4_unicode_ci'
      },
      oguild_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
        unique: true,
        collate: 'utf8mb4_unicode_ci'
      }
    }, {
      tableName: 'guilds',
      timestamps: false, // 타임스탬프 끄기
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
    return Guild;
  };