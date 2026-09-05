/**
 * src/routes/admin.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');
const isAdmin = require('../middleware/isAdmin');

// POST /api/admin/fights/:id/result
// body: { winner_fighter_id, winner_round, winner_method }
router.post('/fights/:id/result', authJWT, isAdmin, async (req, res) => {
  const { winner_fighter_id, winner_round, winner_method } = req.body;
  const fightId = req.params.id;
  try {
    const [fights] = await db.query('SELECT fighter1_id, fighter2_id FROM fights WHERE id=?', [fightId]);
    if (fights.length === 0) return res.status(404).json({ msg: 'Luta não encontrada' });

    const fight = fights[0];
    if (![fight.fighter1_id, fight.fighter2_id].includes(Number(winner_fighter_id))) {
      return res.status(400).json({ msg: 'O vencedor informado não participa desta luta' });
    }
    if (!winner_round || !winner_method) {
      return res.status(400).json({ msg: 'Round e método são obrigatórios' });
    }

    await db.query(
      `UPDATE fights SET winner_fighter_id=?, winner_round=?, winner_method=?, locked=1 WHERE id=?`,
      [winner_fighter_id, winner_round, winner_method, fightId]
    );

    await db.query(`
      UPDATE predictions p
      JOIN fights f ON p.fight_id=f.id
      SET p.points =
        (CASE WHEN p.predicted_winner_fighter_id=f.winner_fighter_id THEN 5 ELSE 0 END) +
        (CASE WHEN p.predicted_round=f.winner_round THEN 3 ELSE 0 END) +
        (CASE WHEN p.predicted_method=f.winner_method THEN 7 ELSE 0 END),
          p.is_correct = (p.predicted_winner_fighter_id=f.winner_fighter_id)
      WHERE f.id=?
    `, [fightId]);

    res.json({ msg: 'Resultado lançado e pontos calculados!' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;