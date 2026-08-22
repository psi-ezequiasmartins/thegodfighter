/**
 * src/middleware/authJWT.js
 */

const jwt = require('jsonwebtoken');

function authJWT(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado' });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ msg: 'Token inválido' });
  }
}

module.exports = authJWT;