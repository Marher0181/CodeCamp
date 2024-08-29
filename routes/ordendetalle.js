const express = require('express');
const router = express.Router();
const Orden = require('../models/Orden');
const OrdenDetalle = require('../models/OrdenDetalle');
const sequelize = require('../db/db');

// Ruta para crear una nueva orden
router.post('/ordenes', async (req, res) => {
  const { encabezado, detalles } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Ejecuta el procedimiento almacenado para crear la orden
    const [result] = await sequelize.query(
      'EXEC sp_InsertarOrden @usuariosId = :usuariosId, @estadoId = :estadoId, @nombreCompleto = :nombreCompleto, @direccion = :direccion, @telefono = :telefono, @correoElectronico = :correoElectronico, @fechaEntrega = :fechaEntrega, @totalOrden = :totalOrden, @idOrden = :idOrden OUTPUT',
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
          idOrden: encabezado.idOrden // Parámetro de salida
        },
        type: sequelize.QueryTypes.RAW,
        transaction
      }
    );

    // Extrae el ID de la orden del resultado
    const idOrden = result[0][0]['@idOrden'];

    // Crea los detalles de la orden
    for (const detalle of detalles) {
      await sequelize.query(
        'EXEC sp_InsertarOrdenDetalles @ordenId = :ordenId, @productoId = :productoId, @cantidad = :cantidad, @precio = :precio',
        {
          replacements: {
            ordenId: idOrden,
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            precio: detalle.precio
          },
          type: sequelize.QueryTypes.RAW,
          transaction
        }
      );
    }

    // Confirma la transacción
    await transaction.commit();
    res.status(201).json({ mensaje: 'Orden creada con éxito', orden: { idOrden } });
  } catch (error) {
    // Deshace la transacción en caso de error
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la orden', error });
  }
});

module.exports = router;

module.exports = router;
