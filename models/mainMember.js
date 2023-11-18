const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: 'localhost',
    port: '3307',
    username: 'root',
    password: '0000',
    database: 'guild_manager',
});

const MainMember = sequelize.define('MainMember', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
