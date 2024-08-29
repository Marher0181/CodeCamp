const express = require('express');
const router = express.Router();
const Orden = require('../models/Orden');
const OrdenDetalle = require('../models/OrdenDetalle');
const sequelize = require('../db/db');

router.post('/ordenes', async (req, res) => {
    const { encabezado, detalles } = req.body;
    console.log(detalles)
    const transaction = await sequelize.transaction();
  
    try {

      const result = await sequelize.query(
        'DECLARE @IdOrden INT;  EXEC sp_InsertarOrden @usuariosId = :usuariosId, @estadoId = :estadoId, @nombreCompleto = :nombreCompleto, @direccion = :direccion, @telefono = :telefono, @correoElectronico = :correoElectronico, @fechaEntrega = :fechaEntrega, @totalOrden = :totalOrden, @IdOrden = @IdOrden OUTPUT; SELECT @IdOrden as IdOrden;',
        {
          replacements: {
            usuariosId: encabezado.usuariosId,
            estadoId: encabezado.estadoId,
            nombreCompleto: encabezado.nombreCompleto,
            direccion: encabezado.direccion,
            telefono: encabezado.telefono,
            correoElectronico: encabezado.correoElectronico,
            fechaEntrega: encabezado.fechaEntrega,
            totalOrden: encabezado.totalOrden,
          },
          type: sequelize.QueryTypes.RAW,
        }
      );
  
      const idOrden = result[0][0].IdOrden;
  

      for (const detalle of detalles) {
        console.log(detalle)
        await sequelize.query(
          'EXEC sp_InsertarOrdenDetalles @ordenId = :ordenId, @productosId = :productoId, @cantidad = :cantidad, @precio = :precio',
          {
            replacements: {
              ordenId: idOrden, productoId: detalle.productoId, cantidad: detalle.cantidad, precio: detalle.precio },
            type: sequelize.QueryTypes.RAW
          }
        );
      }
  
      await transaction.commit();
      res.status(201).json({ mensaje: 'Orden creada con éxito', orden: { idOrden } });
    } catch (error) {

      await transaction.rollback();
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear la orden', error });
    }
  });
  
  module.exports = router;