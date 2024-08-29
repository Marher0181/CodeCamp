const express = require('express');
const router = express.Router();
const sequelize = require('../db/db');
const Categoria = require('../models/categoria');
const authenticateAndAuthorize = require('../middlewares/authMiddleware');


router.post('/insertar', authenticateAndAuthorize(4), async (req, res) => {
    const { usuarioId, nombre, estadoId } = req.body;

    try {
        const result = await sequelize.query(
          'EXEC sp_InsertarCategoria @usuarioId = :usuarioId, @nombre = :nombre, @estadoId = :estadoId',
          {
            replacements: { usuarioId, nombre, estadoId  },
            type: sequelize.QueryTypes.RAW
          }
        );
    
        res.status(201).json({ message: 'Categoria creada correctamente', result });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

router.put('/modificar/:idCategoria', authenticateAndAuthorize(4), async (req, res) => {
    const { idCategoria } = req.params;
    const { usuarioId, nombre, estadoId } = req.body;


    try {
        const result = await sequelize.query(
          'EXEC sp_InsertarCategoria @idCategoria = :idCategoria, @usuarioId = :usuarioId, @nombre = :nombre, @estadoId = :estadoId',
          {
            replacements: { idCategoria, usuarioId, nombre, estadoId  },
            type: sequelize.QueryTypes.RAW
          }
        );
    
        res.status(201).json({ message: 'Categoria modificada correctamente', result });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });


router.get('/obtener', async (req, res) => {
  try {

    const result = await sequelize.query(
        'SELECT * FROM Categoria',
    );
    res.status(201).json({ message: 'Categorias obtenidos correctamente', result });
} catch (error) {
    console.error('Error al obtener las Categorias:', error);
    res.status(500).json({ message: 'Error al obtener la Categorias', error: error.message });
}
});


module.exports = router;