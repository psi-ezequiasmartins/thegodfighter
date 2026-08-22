/**
 * src/routes/ranking.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');

async function getRanking(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.phone, COALESCE(SUM(p.points),0) as points,
             COUNT(CASE WHEN p.is_correct=1 THEN 1 END) as correct_picks,
             COUNT(p.id) as total_picks
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      GROUP BY u.id
      ORDER BY points DESC, correct_picks DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
}

router.get('/', authJWT, getRanking);
module.exports = router;