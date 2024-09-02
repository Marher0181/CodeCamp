// archivo routes/productos.js
const express = require('express');
const router = express.Router();
const sequelize = require('../db/db');
const authenticateAndAuthorize = require('../middlewares/authMiddleware');

router.post('/insertar', authenticateAndAuthorize(4), async (req, res) => {
    const { categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, fecha_creacion, foto } = req.body;
  
    try {
      const result = await sequelize.query(
        'EXEC sp_InsertarProducto @categoriaProductos = :categoriaProductos, @usuarios = :usuarios, @nombre = :nombre, @marca = :marca, @codigo = :codigo, @stock = :stock, @estado = :estado, @precio = :precio, @foto = :foto',
        {
          replacements: { categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, fecha_creacion, foto },
          type: sequelize.QueryTypes.RAW
        }
      );
  
      res.status(201).json({ message: 'Producto creado correctamente', result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

router.put('/modificar/:idProductos', authenticateAndAuthorize(4), async (req, res) => {
    const { idProductos } = req.params;
    const { categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, fecha_creacion, foto } = req.body;
  
    try {
      const result = await sequelize.query(
        'EXEC sp_ModificarProducto @idProductos = :idProductos,@categoriaProductos = :categoriaProductos, @usuarios = :usuarios, @nombre = :nombre, @marca = :marca, @codigo = :codigo, @stock = :stock, @estado = :estado, @precio = :precio, @foto = :foto',
        {
          replacements: { idProductos, categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, fecha_creacion, foto },
          type: sequelize.QueryTypes.RAW
        }
      );
  
      res.status(201).json({ message: 'Producto modificado correctamente', result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

router.get('/obtener', authenticateAndAuthorize(5), async (req, res) => {  
    try {

        const result = await sequelize.query(
            'SELECT categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, foto FROM productos where estado = 4 ',
            //El 4 significa "ACTIVO" para realizar eliminados lógicos
        );
        res.status(201).json({ message: 'Productos obtenidos correctamente', result });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
  });
  
  

module.exports = router;
