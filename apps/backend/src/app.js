const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../../.env' });

const crystalRoutes = require('./routes/crystals');
const chakraRoutes = require('./routes/chakras');
const zodiacRoutes = require('./routes/zodiacs');
const creationTypeRoutes = require('./routes/creationTypes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/crystals', crystalRoutes);
app.use('/api/chakras', chakraRoutes);
app.use('/api/zodiacs', zodiacRoutes);
app.use('/api/creation-types', creationTypeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app;
