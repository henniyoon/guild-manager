const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Server = sequelize.define('Server', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true
    },
}, {
    tableName: 'servers',
    timestamps: false,
    collate: 'utf8mb4_unicode_ci',
    engine: 'InnoDB',
});

module.exports = Server;