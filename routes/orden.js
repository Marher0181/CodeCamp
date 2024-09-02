// routes/orden.js
const express = require('express');
const router = express.Router();
const Orden = require('../models/Orden');
const sequelize = require('../db/db');
const authenticateAndAuthorize = require('../middlewares/authMiddleware');
/*
EL QUE ESTÁ BIEN ES ORDEN DETALEL
*/ 

router.put('/crearCompletada', authenticateAndAuthorize(4), async (req, res) => {

    const { usuariosId, estadoId, nombreCompleto, direccion, telefono,correoElectronico, fechaEntrega, totalOrden} = req.body;
    try {
        const result = await sequelize.query(
          'EXEC sp_InsertarOrden @usuariosId = :usuariosId, @estadoId=:estadoId, @nombreCompleto = :nombreCompleto, @direccion = :direccion, @telefono = :telefono, @correoElectronico = :correoElectronico, @fechaEntrega = :fechaEntrega, @totalOrden = :totalOrden',
          {
            replacements: { usuariosId, estadoId: 9, nombreCompleto, direccion, telefono, correoElectronico, fechaEntrega, totalOrden},
            type: sequelize.QueryTypes.RAW
          }
        );
    
        res.status(201).json({ message: 'Orden creado correctamente', result });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });



router.put('/entregar/:idOrden', authenticateAndAuthorize(4), async (req, res) => {
    const { idOrden } = req.params;
    console.log(idOrden);
    const {  usuariosId, estadoId, nombreCompleto, direccion, telefono,correoElectronico, fechaEntrega, totalOrden } = req.body;


    try {
        const result = await sequelize.query(
          'UPDATE orden set estadoId = :estadoId where idOrden = :idOrden',
          {
            replacements: {  estadoId : 10, idOrden},
            type: sequelize.QueryTypes.RAW
          }
        );
    
        res.status(201).json({ message: 'Orden entregada correctamente', result });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    router.put('/rechazo/:idOrden', authenticateAndAuthorize(4), async (req, res) => {
        const { idOrden } = req.params;
        console.log(idOrden);
        const {  usuariosId, estadoId, nombreCompleto, direccion, telefono,correoElectronico, fechaEntrega, totalOrden } = req.body;
    
    
        try {
            const result = await sequelize.query(
              'UPDATE orden set estadoId = :estadoId where idOrden = :idOrden',
              {
                replacements: {  estadoId : 11, idOrden},
                type: sequelize.QueryTypes.RAW
              }
            );
        
            res.status(201).json({ message: 'Orden Rechazada', result });
          } catch (error) {
            res.status(400).json({ error: error.message });
          }
        });

module.exports = router;
