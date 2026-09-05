/**
 * src/routes/fighters.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authJWT = require('../middleware/authJWT');
const isAdmin = require('../middleware/isAdmin');

async function listFighters(req, res) {
  try {
    const { search } = req.query;
    const params = [];
    let sql = 'SELECT * FROM fighters';
    if (search) {
      sql += ' WHERE name LIKE ? OR nickname LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY name ASC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getFighter(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM fighters WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: 'Lutador não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createFighter(req, res) {
  try {
    const { name, nickname, weight_class, wins, losses, draws, photo_url, bio } = req.body;
    if (!name) return res.status(400).json({ msg: 'Nome do lutador é obrigatório' });

    const [result] = await db.query(
      `INSERT INTO fighters (name, nickname, weight_class, wins, losses, draws, photo_url, bio)
       VALUES (?,?,?,?,?,?,?,?)`,
      [name, nickname || null, weight_class || null, wins || 0, losses || 0, draws || 0, photo_url || null, bio || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ msg: 'Já existe um lutador com esse nome' });
    res.status(500).json({ error: error.message });
  }
}

async function updateFighter(req, res) {
  try {
    const { name, nickname, weight_class, wins, losses, draws, photo_url, bio } = req.body;
    const [existing] = await db.query('SELECT id FROM fighters WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ msg: 'Lutador não encontrado' });
    if (!name) return res.status(400).json({ msg: 'Nome do lutador é obrigatório' });

    await db.query(
      `UPDATE fighters SET name=?, nickname=?, weight_class=?, wins=?, losses=?, draws=?, photo_url=?, bio=?
       WHERE id=?`,
      [name, nickname || null, weight_class || null, wins || 0, losses || 0, draws || 0, photo_url || null, bio || null, req.params.id]
    );
    res.json({ msg: 'Lutador atualizado' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ msg: 'Já existe um lutador com esse nome' });
    res.status(500).json({ error: error.message });
  }
}

async function deleteFighter(req, res) {
  try {
    const [existing] = await db.query('SELECT id FROM fighters WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ msg: 'Lutador não encontrado' });

    await db.query('DELETE FROM fighters WHERE id = ?', [req.params.id]);
    res.json({ msg: 'Lutador removido' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({ msg: 'Lutador está vinculado a lutas e não pode ser removido' });
    }
    res.status(500).json({ error: error.message });
  }
}

router.get('/', listFighters);
router.get('/:id', getFighter);
router.post('/', authJWT, isAdmin, createFighter);
router.put('/:id', authJWT, isAdmin, updateFighter);
router.delete('/:id', authJWT, isAdmin, deleteFighter);

module.exports = router;
