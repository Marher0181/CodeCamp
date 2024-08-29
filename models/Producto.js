const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Producto = sequelize.define('Producto',{
    idProductos:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    categoriaProductos: {
        type: DataTypes.INTEGER,
        allowNullValues: false,
    },
    usuarios: {
        type: DataTypes.INTEGER,
        allowNullValues: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNullValues: false,
    },
    marca: {
        type: DataTypes.STRING,
        allowNullValues: false,
    },
    codigo:{
        type: DataTypes.STRING,
        allowNullValues: false,
    },
    stock:{
        type: DataTypes.DECIMAL,
        allowNullValues: false,
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNullValues: false,
    },
    precio:{
        type: DataTypes.DECIMAL,
        allowNullValues: false,
    },
    fecha_creacion:{
        type: DataTypes.DATE,
        allowNullValues: false,
    },
    foto: {
        type: DataTypes.BLOB,
        allowNullValues: true,
    }
},{
    tableName: 'productos',
    freezeTableName: false, 
    timestamps: false,
});

module.exports = Producto;