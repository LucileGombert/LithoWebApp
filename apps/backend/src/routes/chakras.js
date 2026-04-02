const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.get('/', async (req, res) => {
  try {
    const chakras = await prisma.chakra.findMany({ orderBy: { position: 'asc' } });
    res.json(chakras);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération chakras' });
  }
});

module.exports = router;
