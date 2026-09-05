/**
 * src/index.js
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/predictions');
const fightRoutes = require('./routes/fights');
const fighterRoutes = require('./routes/fighters');
const rankingRoutes = require('./routes/ranking');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/uploads');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/fights', fightRoutes);
app.use('/api/fighters', fighterRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ msg: "The Godfighter API ON" });
});

app.listen(process.env.PORT, () => {
  console.log('API rodando em http://localhost:' + process.env.PORT);
});