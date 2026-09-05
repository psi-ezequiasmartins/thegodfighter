/**
 * src/routes/users.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');
const isAdmin = require('../middleware/isAdmin');

async function listUsers(req, res) {
  try {
    const [rows] = await db.query('SELECT id, phone, name, role, verified, created_at FROM users ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const validRoles = ['fan', 'athlete', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Papel inválido' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ msg: 'Usuário não encontrado' });

    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ msg: 'Papel do usuário atualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

router.get('/', authJWT, isAdmin, listUsers);
router.put('/:id/role', authJWT, isAdmin, updateUserRole);

module.exports = router;
