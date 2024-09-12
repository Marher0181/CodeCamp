// routes/orden.js
const express = require('express');
const router = express.Router();
const Orden = require('../models/Orden');
const sequelize = require('../db/db');
const authenticateAndAuthorize = require('../middlewares/authMiddleware');
/*
EL QUE ESTÁ BIEN ES ORDEN DETALEL
*/ 

router.get('/orden/:idOrden', authenticateAndAuthorize(4), async (req, res) => {  
  const { idOrden } = req.params;
  try {

      const result = await sequelize.query(
          'select idOrdenDetalles, Orden.idOrden, Orden.nombreCompleto, productos.idProductos, productos.nombre, cantidad, OrdenDetalles.precio, subtotal FROM OrdenDetalles ' +
          'INNER JOIN Orden on Ordendetalles.ordenId = Orden.idOrden ' +
          'INNER JOIN productos ON OrdenDetalles.productosId = productos.idProductos ' + 
          'Where OrdenDetalles.ordenId = :idOrden ',
          {
            replacements: {idOrden: idOrden,
              type: sequelize.QueryTypes.RAW
            }
          }
      );
      res.status(201).json({ message: 'Ordenes obtenidass correctamente', result });
      console.log('antes')
      console.log(result);
  } catch (error) {
      console.error('Error al obtener las Ordenes:', error);
      res.status(500).json({ message: 'Error al obtener las Ordenes', error: error.message });
  }
});


router.get('/obtener', authenticateAndAuthorize(4), async (req, res) => {  
  try {

      const result = await sequelize.query(
          'SELECT idOrden, usuariosId, estadoId,  estados.nombre, fechaCreacion, nombreCompleto, direccion, telefono, correoElectronico, fechaEntrega, totalOrden FROM Orden ' + 
          'Inner join Estados on Orden.estadoId = Estados.idEstados where estadoId != 5',
          //El 4 significa "ACTIVO" para realizar eliminados lógicos
      );
      res.status(201).json({ message: 'Ordenes obtenidass correctamente', result });
      console.log('antes')
      console.log(result);
  } catch (error) {
      console.error('Error al obtener las Ordenes:', error);
      res.status(500).json({ message: 'Error al obtener las Ordenes', error: error.message });
  }
});



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
