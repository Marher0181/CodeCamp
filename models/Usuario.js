const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Usuario = sequelize.define('NuevoUsuario', {
  idUsuarios: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rolId:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estadosId:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  correoElectronico:{
    type: DataTypes.STRING,
    allowNull: false
  },
  nombreCompleto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fechaNacimiento:{
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Usuarios',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Usuario;
