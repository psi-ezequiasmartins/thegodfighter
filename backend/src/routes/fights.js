/**
 * src/routes/fights.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');
const isAdmin = require('../middleware/isAdmin');

async function getFight(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT f.*, f1.name as fighter1_name, f1.photo_url as fighter1_photo_url,
              f2.name as fighter2_name, f2.photo_url as fighter2_photo_url, fw.name as winner_name
       FROM fights f
       JOIN fighters f1 ON f1.id = f.fighter1_id
       JOIN fighters f2 ON f2.id = f.fighter2_id
       LEFT JOIN fighters fw ON fw.id = f.winner_fighter_id
       WHERE f.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Luta não encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateFight(req, res) {
  try {
    const { fighter1_id, fighter2_id, weight_class, locked } = req.body;
    const [existing] = await db.query('SELECT * FROM fights WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ msg: 'Luta não encontrada' });

    const fight = existing[0];
    const newFighter1 = fighter1_id ?? fight.fighter1_id;
    const newFighter2 = fighter2_id ?? fight.fighter2_id;
    if (newFighter1 === newFighter2) return res.status(400).json({ msg: 'Os lutadores devem ser diferentes' });

    const [fighters] = await db.query('SELECT id FROM fighters WHERE id IN (?,?)', [newFighter1, newFighter2]);
    if (fighters.length !== 2) return res.status(400).json({ msg: 'Lutador informado não existe' });

    await db.query(
      'UPDATE fights SET fighter1_id=?, fighter2_id=?, weight_class=?, locked=? WHERE id=?',
      [newFighter1, newFighter2, weight_class ?? fight.weight_class, locked ?? fight.locked, req.params.id]
    );
    res.json({ msg: 'Luta atualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteFight(req, res) {
  try {
    const [existing] = await db.query('SELECT event_id FROM fights WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ msg: 'Luta não encontrada' });

    await db.query('DELETE FROM fights WHERE id = ?', [req.params.id]);
    await db.query('UPDATE events SET fights_count = GREATEST(fights_count - 1, 0) WHERE id = ?', [existing[0].event_id]);
    res.json({ msg: 'Luta removida' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({ msg: 'Luta possui palpites e não pode ser removida' });
    }
    res.status(500).json({ error: error.message });
  }
}

router.get('/:id', getFight);
router.put('/:id', authJWT, isAdmin, updateFight);
router.delete('/:id', authJWT, isAdmin, deleteFight);

module.exports = router;