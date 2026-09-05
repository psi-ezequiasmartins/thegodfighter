/**
 * src/routes/predictions.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');

async function createPrediction(req, res) {
  try {
    const { fight_id, predicted_winner_fighter_id, predicted_round, predicted_method } = req.body;
    const user_id = req.user.id;

    const [fights] = await db.query('SELECT locked, event_id, fighter1_id, fighter2_id FROM fights WHERE id =?', [fight_id]);
    if (fights.length === 0) {
      return res.status(404).json({ msg: 'Luta não encontrada' });
    }

    if (fights[0].locked === 1) {
      return res.status(403).json({ msg: 'Palpites travados para esta luta' });
    }

    if (predicted_winner_fighter_id && ![fights[0].fighter1_id, fights[0].fighter2_id].includes(Number(predicted_winner_fighter_id))) {
      return res.status(400).json({ msg: 'O lutador escolhido não participa desta luta' });
    }

    const [result] = await db.query(
      `INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method)
       VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
       predicted_winner_fighter_id = VALUES(predicted_winner_fighter_id),
       predicted_round = VALUES(predicted_round),
       predicted_method = VALUES(predicted_method)`,
      [user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method]
    );

    res.status(201).json({ msg: 'Palpite salvo', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletePrediction(req, res) {
  try {
    const user_id = req.user.id;
    const [predictions] = await db.query(
      `SELECT p.id, f.locked FROM predictions p JOIN fights f ON p.fight_id = f.id
       WHERE p.fight_id = ? AND p.user_id = ?`,
      [req.params.fightId, user_id]
    );
    if (predictions.length === 0) return res.status(404).json({ msg: 'Palpite não encontrado' });
    if (predictions[0].locked === 1) return res.status(403).json({ msg: 'Palpites travados para esta luta' });

    await db.query('DELETE FROM predictions WHERE fight_id = ? AND user_id = ?', [req.params.fightId, user_id]);
    res.json({ msg: 'Palpite removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listMyPredictions(req, res) {
  try {
    const user_id = req.user.id;
    const [rows] = await db.query(
      `SELECT p.*, f1.name as fighter1_name, f2.name as fighter2_name
       FROM predictions p
       JOIN fights f ON p.fight_id = f.id
       JOIN fighters f1 ON f1.id = f.fighter1_id
       JOIN fighters f2 ON f2.id = f.fighter2_id
       WHERE p.user_id =?`,
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET /predictions/me - meus palpites
async function getMyPredictions(req, res) {
  try {
    const user_id = req.user.id;
    const [rows] = await db.query(
      `SELECT p.*, f.locked, f1.name as fighter1_name, f1.photo_url as fighter1_photo_url,
              f2.name as fighter2_name, f2.photo_url as fighter2_photo_url,
              CONCAT(f1.name, ' vs ', f2.name) as fight
       FROM predictions p
       JOIN fights f ON p.fight_id = f.id
       JOIN fighters f1 ON f1.id = f.fighter1_id
       JOIN fighters f2 ON f2.id = f.fighter2_id
        WHERE p.user_id =?
        ORDER BY p.created_at DESC`,
      [user_id]
    );
    res.json(rows);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  } 
}

router.post('/', authJWT, createPrediction);
router.delete('/:fightId', authJWT, deletePrediction);
router.get('/my', authJWT, listMyPredictions);
router.get('/me', authJWT, getMyPredictions);

module.exports = router;