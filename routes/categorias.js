const express = require('express');
const router = express.Router();
const sequelize = require('../db/db');
const Categoria = require('../models/Categoria');
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
          'EXEC sp_ModificarCategoria @idCategoria = :idCategoria, @usuarioId = :usuarioId, @nombre = :nombre, @estadoId = :estadoId',
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

    router.put('/eliminar/:idCategoria', authenticateAndAuthorize(4), async (req, res) => {
      const { idCategoria } = req.params;
  
  
      try {
          const result = await sequelize.query(
            'EXEC sp_EliminarCategoria @idCategoria = :idCategoria',
            {
              replacements: { idCategoria},
              type: sequelize.QueryTypes.RAW
            }
          );
      
          res.status(201).json({ message: 'Categoria modificada correctamente', result });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      });


    router.get('/obtener', authenticateAndAuthorize(4), async (req, res) => {
      try {
        // Utilizando Sequelize Model para la consulta
        const categories = await sequelize.query(
          'SELECT nombre, idCategoria, estadoId FROM Categoria WHERE estadoId != 5',
          {
            type: sequelize.QueryTypes.SELECT // Esto garantiza que se devuelvan los resultados como objetos
          }
        );
        if(categories.length < 0 ) {
          res.status(202).json({ message: 'No hay categorias para mostrar'})
        }
        res.status(200).json({ categories });
      } catch (error) {
        console.error('Error al obtener las Categorías:', error);
        res.status(500).json({ message: 'Error al obtener las Categorías', error: error.message });
      }
    });
    


module.exports = router;