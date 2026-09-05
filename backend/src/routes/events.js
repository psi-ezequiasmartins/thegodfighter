/**
 * src/routes/events.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');
const isAdmin = require('../middleware/isAdmin');

async function listEvents(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY event_date ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getEvent(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: 'Evento não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createEvent(req, res) {
  try {
    const { name, event_date, status, image_url } = req.body;
    if (!name || !event_date) return res.status(400).json({ msg: 'Nome e data do evento são obrigatórios' });

    const [result] = await db.query(
      'INSERT INTO events (name, event_date, status, image_url) VALUES (?,?,?,?)',
      [name, event_date, status || 'open', image_url || null]
    );
    res.status(201).json({ id: result.insertId, name, event_date, status: status || 'open', image_url: image_url || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateEvent(req, res) {
  try {
    const { name, event_date, status, image_url } = req.body;
    const [existing] = await db.query('SELECT id, image_url FROM events WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ msg: 'Evento não encontrado' });
    if (!name || !event_date) return res.status(400).json({ msg: 'Nome e data do evento são obrigatórios' });

    await db.query(
      'UPDATE events SET name=?, event_date=?, status=?, image_url=? WHERE id=?',
      [name, event_date, status || 'open', image_url ?? existing[0].image_url, req.params.id]
    );
    res.json({ msg: 'Evento atualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteEvent(req, res) {
  try {
    const [existing] = await db.query('SELECT id FROM events WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ msg: 'Evento não encontrado' });

    await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ msg: 'Evento removido' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({ msg: 'Evento possui lutas cadastradas e não pode ser removido' });
    }
    res.status(500).json({ error: error.message });
  }
}

async function listFights(req, res) {
  try {
    const [events] = await db.query('SELECT id FROM events WHERE id = ?', [req.params.id]);
    if (events.length === 0) return res.status(404).json({ msg: 'Evento não encontrado' });

    const [rows] = await db.query(
      `SELECT f.*, f1.name as fighter1_name, f1.photo_url as fighter1_photo_url,
              f2.name as fighter2_name, f2.photo_url as fighter2_photo_url, fw.name as winner_name
       FROM fights f
       JOIN fighters f1 ON f1.id = f.fighter1_id
       JOIN fighters f2 ON f2.id = f.fighter2_id
       LEFT JOIN fighters fw ON fw.id = f.winner_fighter_id
       WHERE f.event_id = ?
       ORDER BY f.id ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createFight(req, res) {
  try {
    const { fighter1_id, fighter2_id, weight_class } = req.body;
    const [events] = await db.query('SELECT id FROM events WHERE id = ?', [req.params.id]);
    if (events.length === 0) return res.status(404).json({ msg: 'Evento não encontrado' });

    if (!fighter1_id || !fighter2_id) return res.status(400).json({ msg: 'Os dois lutadores são obrigatórios' });
    if (fighter1_id === fighter2_id) return res.status(400).json({ msg: 'Os lutadores devem ser diferentes' });

    const [fighters] = await db.query('SELECT id FROM fighters WHERE id IN (?,?)', [fighter1_id, fighter2_id]);
    if (fighters.length !== 2) return res.status(400).json({ msg: 'Lutador informado não existe' });

    const [result] = await db.query(
      'INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class) VALUES (?,?,?,?)',
      [req.params.id, fighter1_id, fighter2_id, weight_class || null]
    );

    await db.query('UPDATE events SET fights_count = fights_count + 1 WHERE id = ?', [req.params.id]);

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', authJWT, isAdmin, createEvent);
router.put('/:id', authJWT, isAdmin, updateEvent);
router.delete('/:id', authJWT, isAdmin, deleteEvent);
router.get('/:id/fights', listFights);
router.post('/:id/fights', authJWT, isAdmin, createFight);

module.exports = router;