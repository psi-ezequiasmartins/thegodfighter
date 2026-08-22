/**
 * src/routes/admin.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');

// só admin - no seu users precisa ter role='admin'
async function isAdmin(req, res, next) {
  const [rows] = await db.query('SELECT role FROM users WHERE id=?', [req.user.id]);
  if (rows[0]?.role!== 'admin') return res.status(403).json({msg:'Só admin'});
  next();
}

// POST /api/admin/fights/:id/result
// body: { winner_name, winner_round, winner_method }
router.post('/fights/:id/result', authJWT, isAdmin, async (req,res)=>{
  const { winner_name, winner_round, winner_method } = req.body;
  const fightId = req.params.id;
  try {
    await db.query(`UPDATE fights SET winner_name=?, winner_round=?, winner_method=?, locked=1 WHERE id=?`,
      [winner_name, winner_round, winner_method, fightId]);

    await db.query(`
      UPDATE predictions p
      JOIN fights f ON p.fight_id=f.id
      SET p.points =
        (CASE WHEN p.predicted_winner_name=f.winner_name THEN 5 ELSE 0 END) +
        (CASE WHEN p.predicted_round=f.winner_round THEN 3 ELSE 0 END) +
        (CASE WHEN p.predicted_method=f.winner_method THEN 7 ELSE 0 END),
          p.is_correct = (p.predicted_winner_name=f.winner_name)
      WHERE f.id=?
    `, [fightId]);

    res.json({msg:'Resultado lançado e pontos calculados!'});
  } catch(e){ res.status(500).json({error:e.message}) }
});

module.exports = router;