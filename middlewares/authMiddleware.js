const jwt = require('jsonwebtoken');
const SECRET_KEY = 'codecamp_secret'// Asegúrate de tener SECRET_KEY en tu .env


const authenticateAndAuthorize = (requiredRole) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido' });
      }

      if (decoded.rolId !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
      }

      req.user = decoded; 
      next();
    });
  };
};

module.exports = authenticateAndAuthorize;
