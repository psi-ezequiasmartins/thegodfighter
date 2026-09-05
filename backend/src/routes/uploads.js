/**
 * src/routes/uploads.js
 */

const express = require('express');
const router = express.Router();
const authJWT = require('../middleware/authJWT');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload');

// POST /api/uploads/image - envia uma imagem (evento ou lutador) e retorna a URL pública
router.post('/image', authJWT, isAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!req.file) return res.status(400).json({ msg: 'Nenhuma imagem enviada' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

module.exports = router;
