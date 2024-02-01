module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      guild_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'guilds', // 다른 모델 이름을 참조. 실제 모델 이름이나 테이블 이름에 따라 다를 수 있음
          key: 'id'
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      grade: {
        type: DataTypes.ENUM('master', 'sub_master', 'member'),
        allowNull: true
      }
    }, {
      tableName: 'users',
      timestamps: false, // 타임스탬프 끄기
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
    return User;
  };
  