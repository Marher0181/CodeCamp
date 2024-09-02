const express = require('express');
const router = express.Router();
const Orden = require('../models/Orden');
const OrdenDetalle = require('../models/OrdenDetalle');
const sequelize = require('../db/db');
const authenticateAndAuthorize = require('../middlewares/authMiddleware');
/*

OBTENER ORDEN 

*/
router.post('/ordenes', authenticateAndAuthorize(5), async (req, res) => {
  const { usuariosId, estadoId, nombreCompleto, direccion, telefono, correoElectronico, fechaEntrega, totalOrden, detalles } = req.body;
  const transaction = await sequelize.transaction();

  const jsonEntry = JSON.stringify({
      usuariosId,
      estadoId,
      nombreCompleto,
      direccion,
      telefono,
      correoElectronico,
      fechaEntrega,
      totalOrden,
      detalles
  });

  console.log(jsonEntry); 
  try {
      const result = await sequelize.query(
          'DECLARE @JSON NVARCHAR(MAX); ' +
          'DECLARE @IdResultado INT; ' +
          'DECLARE @Resultado NVARCHAR(255); ' +
          'SET @JSON = :jsonEntry; ' +
          'EXEC SP_Carrito_Insertar @JSON, @IdResultado OUTPUT, @Resultado OUTPUT; ' +
          'SELECT @IdResultado AS IdResultado, @Resultado AS Resultado;',
          {
              replacements: { jsonEntry },
              type: sequelize.QueryTypes.RAW,
          }
      );


      res.status(201).json({ message: 'Orden creado correctamente', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  
  module.exports = router;