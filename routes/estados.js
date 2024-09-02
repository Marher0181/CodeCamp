const express = require('express');
const router = express.Router();
const Estado = require('../models/Estado');
const sequelize = require('../db/db');
const authenticateAndAuthorize = require('../middlewares/authMiddleware');

router.post('/insertar', authenticateAndAuthorize(4), async (req, res) => {
  const { nombre } = req.body;

  try {
    const result = await sequelize.query(
      'EXEC sp_InsertarEstado @nombre = :nombre',
      {
        replacements: { nombre },
        type: sequelize.QueryTypes.RAW
      }
    );

    res.status(201).json({ message: 'Estado creado correctamente', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/modificar/:idEstados', authenticateAndAuthorize(4), async (req, res) => {
  const { idEstados } = req.params;
  const { nombre } = req.body;

  try {
    const result = await sequelize.query(
      'EXEC sp_ModificarEstado @idEstados = :idEstados, @nombre = :nombre',
      {
        replacements: { idEstados, nombre },
        type: sequelize.QueryTypes.RAW
      }
    );

    res.status(201).json({ message: 'Estado modificado correctamente', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/obtener', authenticateAndAuthorize(5), async (req, res) => {
  try {

    const result = await sequelize.query(
        'SELECT idEstados, nombre FROM estados',
    );
    res.status(201).json({ message: 'Estados obtenidos correctamente', result });
} catch (error) {
    console.error('Error al obtener los Estado:', error);
    res.status(500).json({ message: 'Error al obtener los Estados', error: error.message });
  }
});



module.exports = router;
