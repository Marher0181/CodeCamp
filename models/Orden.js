const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Usuario = require('./Usuario');

const Orden = sequelize.define('Orden', {
  idOrden: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuariosId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  estadoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  nombreCompleto: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  correoElectronico: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  fechaEntrega: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  totalOrden: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: 'Orden',
  timestamps: false,
});

Orden.belongsTo(Usuario, { foreignKey: 'usuariosId' });

module.exports = Orden;
