/**
 * src/routes/auth.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  try {
    const { phone, name } = req.body;

    if (!phone) {
      return res.status(400).json({ msg: 'Telefone é obrigatório' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE phone =?', [phone]);
    if (existing.length > 0) {
      return res.status(409).json({ msg: 'Usuário já existe' });
    }

    const [result] = await db.query(
      'INSERT INTO users (phone, name) VALUES (?,?)',
      [phone, name || null]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, phone: phone }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: userId, phone: phone, name: name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ msg: 'Telefone é obrigatório' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE phone =?', [phone]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

router.post('/register', register);
router.post('/login', login);

module.exports = router;