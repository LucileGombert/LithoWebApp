const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.get('/', async (req, res) => {
  try {
    const types = await prisma.creationType.findMany({ orderBy: { name: 'asc' } });
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération types de création' });
  }
});

module.exports = router;
