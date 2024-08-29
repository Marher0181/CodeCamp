const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Orden = require('./Orden');
const Producto = require('./Producto');

const OrdenDetalle = sequelize.define('OrdenDetalle', {
  idOrdenDetalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ordenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  tableName: 'OrdenDetalle',
  timestamps: false,
});

OrdenDetalle.belongsTo(Orden, { foreignKey: 'ordenId' });
OrdenDetalle.belongsTo(Producto, { foreignKey: 'productoId' });

module.exports = OrdenDetalle;
