/**
 * src/server.js
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/predictions');
const fightRoutes = require('./routes/fights');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/fights', fightRoutes);

function healthCheck(req, res) {
  res.json({ msg: "The Godfighter API ON" });
}

app.get('/', healthCheck);
app.use('/api/events', eventRoutes);

function startServer() {
  app.listen(process.env.PORT, function() {
    console.log('API rodando em http://localhost:' + process.env.PORT);
  });
}

startServer();