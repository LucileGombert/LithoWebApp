const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.get('/', async (req, res) => {
  try {
    const precautions = await prisma.precaution.findMany({ orderBy: { description: 'asc' } });
    res.json(precautions);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération précautions' });
  }
});

module.exports = router;