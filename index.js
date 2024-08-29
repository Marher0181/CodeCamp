const express = require('express');
const bodyParser = require('body-parser');
const usuariosRoutes = require('./routes/usuarios');
const estadosRoutes = require('./routes/estados');
const rolesRoutes = require('./routes/roles');
const produtosRoutes = require('./routes/productos');
const categoriaRoutes = require('./routes/categorias');
const ordenRoutes = require('./routes/orden');
const ordenDetalleRoutes = require('./routes/ordendetalle');
const sequelize = require('./db/db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use('/api/productos', produtosRoutes); 
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/estados', estadosRoutes);
app.use('/api/roles', rolesRoutes); 
app.use('/api/categoria', categoriaRoutes)
app.use('/api/orden', ordenRoutes); 
app.use('/api/ordenDetalle', ordenDetalleRoutes);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Conexión a la base de datos establecida');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
