const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Rol = sequelize.define('Rol',{
    idRol:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'Rol',
    freezeTableName: true,
});

module.exports = Rol;