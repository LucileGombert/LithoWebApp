const express = require('express');
const router = express.Router();
const crystalController = require('../controllers/crystalController');

// Routes spéciales AVANT /:id pour éviter les conflits
router.post('/suggest', crystalController.suggestForCreation);
router.post('/generate', crystalController.generateWithAI);
router.get('/slug/:slug', crystalController.getCrystalBySlug);

// CRUD standard
router.get('/', crystalController.getCrystals);
router.get('/:id', crystalController.getCrystalById);
router.post('/', crystalController.createCrystal);
router.put('/:id', crystalController.updateCrystal);
router.delete('/:id', crystalController.deleteCrystal);

// Stock
router.put('/:id/stock', crystalController.updateStock);

module.exports = router;
