const jwt = require('jsonwebtoken');
const SECRET_KEY = 'codecamp_secret';

const authenticateAndAuthorize = (requiredRoleId) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }

      if (decoded.rolId !== requiredRoleId) {
        return res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
      }

      req.user = decoded; 
      next();
    });
  };
};

const authenticateAndAuthorizePro = (requiredRoleId, requiredRoleId2) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }

      if (decoded.rolId !== requiredRoleId || decoded.rolId !== requiredRoleId2) {
        return res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
      }

      req.user = decoded; 
      next();
    });
  };
};

module.exports = authenticateAndAuthorize, authenticateAndAuthorizePro;
