/**
 * src/routes/events.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');

async function listEvents(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY event_date ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createEvent(req, res) {
  try {
    const { name, event_date } = req.body;
    const [result] = await db.query('INSERT INTO events (name, event_date) VALUES (?,?)', [name, event_date]);
    res.status(201).json({ id: result.insertId, name: name, event_date: event_date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listFights(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM fights WHERE event_id =?', [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createFight(req, res) {
  try {
    const { athlete1_name, athlete2_name } = req.body;
    const [result] = await db.query('INSERT INTO fights (event_id, athlete1_name, athlete2_name) VALUES (?,?,?)', [req.params.id, athlete1_name, athlete2_name]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

router.get('/', listEvents);
router.post('/', authJWT, createEvent);
router.get('/:id/fights', listFights);
router.post('/:id/fights', authJWT, createFight);

module.exports = router;