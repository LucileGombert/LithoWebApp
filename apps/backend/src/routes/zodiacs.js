const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.get('/', async (req, res) => {
  try {
    const signs = await prisma.zodiacSign.findMany({ orderBy: { name: 'asc' } });
    res.json(signs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération signes zodiacaux' });
  }
});

module.exports = router;
