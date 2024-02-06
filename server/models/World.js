const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const World = sequelize.define('World', {
    id: {
        type: DataTypes.TINYINT,
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
    tableName: 'worlds',
    timestamps: false,
    collate: 'utf8mb4_unicode_ci',
    engine: 'InnoDB',
});

module.exports = World;