/**
 * src/routes/fights.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

async function getFight(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM fights WHERE id =?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Luta não encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

router.get('/:id', getFight);

module.exports = router;