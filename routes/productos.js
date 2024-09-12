const express = require('express');
const router = express.Router();
const sequelize = require('../db/db');
const authenticateAndAuthorize = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Buffer } = require('buffer');

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio de destino para los archivos subidos
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nombre único del archivo
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/insertar', authenticateAndAuthorize(4), upload.single('foto'), async (req, res) => {
  const { categoriaProductos, nombre, marca, codigo, stock, estado, precio, fecha_creacion, usuarios } = req.body;
  const fotoPath = req.file ? req.file.path : null;

  let fotoBuffer = null;
  if (fotoPath) {
    fotoBuffer = fs.readFileSync(fotoPath);
  }

  try {
    const result = await sequelize.query(
      'EXEC sp_InsertarProducto @categoriaProductos = :categoriaProductos, @usuarios = :usuarios, @nombre = :nombre, @marca = :marca, @codigo = :codigo, @stock = :stock, @estado = :estado, @precio = :precio, @foto = :foto',
      {
        replacements: { categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, foto: fotoBuffer },
        type: sequelize.QueryTypes.RAW
      }
    );

    res.status(201).json({ message: 'Producto creado correctamente', result });
    console.log(result);
  } catch (error) {
    console.error('Error en la inserción:', error);
    res.status(400).json({ error: error.message });
  }
});

// Ruta para modificar producto con archivo (si es necesario)
router.put('/modificar/:idProductos', authenticateAndAuthorize(4), upload.single('foto'), async (req, res) => {
  const { idProductos } = req.params;
  const { categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, fecha_creacion } = req.body;
  const fotoPath = req.file ? req.file.path : null;

  let fotoBuffer = null;
  if (fotoPath) {
    fotoBuffer = fs.readFileSync(fotoPath);
  }

  try {
    const result = await sequelize.query(
      'EXEC sp_ModificarProducto @idProductos = :idProductos, @categoriaProductos = :categoriaProductos, @usuarios = :usuarios, @nombre = :nombre, @marca = :marca, @codigo = :codigo, @stock = :stock, @estado = :estado, @precio = :precio, @foto = :foto',
      {
        replacements: { idProductos, categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, foto: fotoBuffer },
        type: sequelize.QueryTypes.RAW
      }
    );

    res.status(201).json({ message: 'Producto modificado correctamente', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para obtener productos
router.get('/obtenerAdmin', authenticateAndAuthorize(4), async (req, res) => {
  try {
    const result = await sequelize.query(
      'SELECT idProductos, categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, foto FROM productos WHERE estado = 4',
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    res.status(200).json({ message: 'Productos obtenidos correctamente', result });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
});
router.get('/obtener', authenticateAndAuthorize(5), async (req, res) => {
  try {
    const result = await sequelize.query(
      'SELECT idProductos, categoriaProductos, usuarios, nombre, marca, codigo, stock, estado, precio, foto FROM productos WHERE estado = 4',
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    res.status(200).json({ message: 'Productos obtenidos correctamente', result });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
});
// Ruta para obtener la imagen de un producto
router.get('/imagen/:idProducto',  async (req, res) => {
  const { idProducto } = req.params;

  try {
    const result = await sequelize.query(
      'SELECT foto FROM productos WHERE idProductos = :idProducto',
      {
        replacements: { idProducto },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (result.length > 0 && result[0].foto) {
      res.setHeader('Content-Type', 'image/png'); // O el tipo correcto según el formato de la imagen
      res.send(result[0].foto);
    } else {
      res.status(404).json({ message: 'Imagen no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    res.status(500).json({ message: 'Error al obtener la imagen', error: error.message });
  }
});

// Ruta para eliminar un producto
router.delete('/eliminar/:idProductos', authenticateAndAuthorize(4), async (req, res) => {
  const { idProductos } = req.params;

  try {
    // Ejecuta un procedimiento almacenado para eliminar el producto
    const result = await sequelize.query(
      'EXECUTE sp_EliminarProducto  @idProducto = :idProductos',
      {
        replacements: { idProductos },
        type: sequelize.QueryTypes.RAW
      }
    );
    console.log(result);
    if (result[1] > 0) {
      res.status(200).json({ message: 'Producto eliminado correctamente' });
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
});

module.exports = router;
