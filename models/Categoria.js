const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Usuario = require('./Usuario');
const Estado = require('./Estado');

const Categoria = sequelize.define('Categoria', {
  idCategoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nombre: {
    type: DataTypes.STRING(45),
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
}, {
  tableName: 'Categoria',
  freezeTableName: true,
  timestamps: false,
});

Categoria.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Categoria.belongsTo(Estado, { foreignKey: 'estadoId' });

module.exports = Categoria;
