const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Estado = sequelize.define('Estado', {
  idEstados: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Estados',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Estado;