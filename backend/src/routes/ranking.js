/**
 * src/routes/ranking.js
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middlewares/auth');  

function getRanking(req, res) {
  // Query soma pontos das predictions
  db.query(`
    SELECT u.id, u.name, SUM(p.points) as points, COUNT(CASE WHEN p.is_correct=1 THEN 1 END) as correct_picks
    FROM users u
    LEFT JOIN predictions p ON p.user_id = u.id 
    GROUP BY u.id
    ORDER BY points DESC
  `, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar ranking' });
    }
    res.json(rows);
  });
}   

router.get('/', authMiddleware, getRanking);

module.exports = router;