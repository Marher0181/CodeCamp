const express = require('express');
const Usuario = require('../models/Usuario');
const sequelize = require('../db/db');
const bcrypt = require('bcryptjs');
const authenticateAndAuthorize = require('../middlewares/authMiddleware');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'codecamp_secret'

router.post('/register', async (req, res) => {
  const { rolId, estadosId, nombreCompleto, correoElectronico, password, telefono, fechaNacimiento } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await sequelize.query(
          'EXEC sp_InsertarUsuario  :rolId, :estadosId, :correoElectronico, :nombreCompleto, :password, :telefono, :fechaNacimiento',
          {
              replacements: { rolId, estadosId,  correoElectronico, nombreCompleto, password: hashedPassword, telefono, fechaNacimiento },
              type: sequelize.QueryTypes.RAW
          }
      );

      res.status(201).json({ message: 'Usuario registrado correctamente', result });
  } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
});
/*
TODOS LOS DEMÁS DEBEN LLEVAR VALIDACION (CLIENTE)  excepto Registro y Login
*/

router.post('/login', async (req, res) => {
  const { correoElectronico, password } = req.body;

  try {
      const user = await sequelize.query(
          'SELECT * FROM usuarios WHERE correoElectronico = :correoElectronico',
          {
              replacements: { correoElectronico },
              type: sequelize.QueryTypes.SELECT
          }
      );

      if (user.length === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      console.log(user);
      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign(
        { id: user[0].idUsuarios, correoElectronico: user[0].correoElectronico, rolId: user[0].rolId },
        SECRET_KEY,
        { expiresIn: '24h' }
      ); 

      res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});


router.put('/modificar', authenticateAndAuthorize(5), async (req, res) => {
  try {
      const { idUsuarios, rolId, estadosId, correoElectronico, nombreCompleto, password, telefono, fechaNacimiento } = req.body;

      if ( !idUsuarios || !rolId || !estadosId || !correoElectronico || !nombreCompleto || !password || !telefono || !fechaNacimiento ) {
          return res.status(400).json({ message: 'Faltan datos requeridos' });
      }

      const result = await sequelize.query('EXEC sp_ModificarUsuario :idUsuarios, :rolId, :estadosId, :correoElectronico, :nombreCompleto, :password, :telefono, :fechaNacimiento', {
          replacements: { idUsuarios, rolId, estadosId, correoElectronico, nombreCompleto, password, telefono, fechaNacimiento},
          type: sequelize.QueryTypes.RAW
      });

      res.status(200).json({ message: 'Usuario insertado correctamente', result });
  } catch (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      res.status(500).json({ message: 'Error al insertar el usuario', error: error.message });
  }
});

router.get('/obtener', authenticateAndAuthorize(4), async (req, res) => {

  try {
    const result = await sequelize.query(
      'SELECT * FROM Usuarios'
    );

    res.status(201).json({ message: 'Usuarios obtenidos', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
