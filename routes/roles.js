const express = require('express');
const Rol = require('../models/Rol');
const router = express.Router();
const sequelize = require('../db/db');
const authenticateAndAuthorize = require('../middlewares/authMiddleware');

router.post('/insertar', authenticateAndAuthorize(4), async (req, res) => {
    const { nombre } = req.body;
  
    try {
      const result = await sequelize.query(
        'EXEC sp_InsertarRol @nombre = :nombre',
        {
          replacements: { nombre },
          type: sequelize.QueryTypes.RAW
        }
      );
  
      res.status(201).json({ message: 'Rol creado correctamente', result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

router.put('/modificar/:idRol', authenticateAndAuthorize(4), async (req, res) => {
  const { idRol } = req.params;
  const { nombre } = req.body;

  try {
    const result = await sequelize.query(
      'EXEC sp_ModificarRol @idRol = :idRol, @nombre = :nombre',
      {
        replacements: { idRol, nombre },
        type: sequelize.QueryTypes.RAW
      }
    );

    res.status(201).json({ message: 'Rol modificado correctamente', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/obtener', authenticateAndAuthorize(4), async (req, res) => {
  try {
    const result = await sequelize.query(
      'SELECT * FROM Rol'
    );
    res.status(201).json({ message: 'Roles obtenidos', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;