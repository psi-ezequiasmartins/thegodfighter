/**
 * src/middleware/isAdmin.js
 */

const db = require('../config/db');

async function isAdmin(req, res, next) {
  try {
    const [rows] = await db.query('SELECT role FROM users WHERE id=?', [req.user.id]);
    if (rows[0]?.role !== 'admin') return res.status(403).json({ msg: 'Só admin' });
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = isAdmin;
