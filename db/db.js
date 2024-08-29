const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('codecamp_db', 'ADMIN', 'ADMIN', {
  host: 'DESKTOP-HMS6GDC\\SQLEXPRESS',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      port: 53122,
      encrypt: true, 
      trustServerCertificate: true
    }
  },
  logging: false,
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = sequelize;
