/**
 * src/routes/predictions.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');

async function createPrediction(req, res) {
  try {
    const { fight_id, predicted_winner_name, predicted_round, predicted_method } = req.body;
    const user_id = req.user.id;

    const [fights] = await db.query('SELECT locked, event_id FROM fights WHERE id =?', [fight_id]);
    if (fights.length === 0) {
      return res.status(404).json({ msg: 'Luta não encontrada' });
    }

    if (fights[0].locked === 1) {
      return res.status(403).json({ msg: 'Palpites travados para esta luta' });
    }

    const [result] = await db.query(
      `INSERT INTO predictions (user_id, fight_id, predicted_winner_name, predicted_round, predicted_method)
       VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
       predicted_winner_name = VALUES(predicted_winner_name),
       predicted_round = VALUES(predicted_round),
       predicted_method = VALUES(predicted_method)`,
      [user_id, fight_id, predicted_winner_name, predicted_round, predicted_method]
    );

    res.status(201).json({ msg: 'Palpite salvo', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listMyPredictions(req, res) {
  try {
    const user_id = req.user.id;
    const [rows] = await db.query(
      `SELECT p.*, f.athlete1_name, f.athlete2_name
       FROM predictions p
       JOIN fights f ON p.fight_id = f.id
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
      `SELECT p.*, CONCAT(f.athlete1_name, ' vs ', f.athlete2_name) as fight
       FROM predictions p
       JOIN fights f ON p.fight_id = f.id
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
router.get('/my', authJWT, listMyPredictions);
router.get('/me', authJWT, getMyPredictions);

module.exports = router;