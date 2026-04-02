const crystalService = require('../services/crystalService');
const researchService = require('../services/researchService');

/**
 * GET /api/crystals
 * Supports: ?search=, ?color=, ?chakra=, ?zodiac=, ?virtue=
 */
async function getCrystals(req, res) {
  try {
    const { search, color, chakra, zodiac, virtue } = req.query;
    const crystals = await crystalService.getAllCrystals({ search, color, chakra, zodiac, virtue });
    res.json(crystals);
  } catch (err) {
    console.error('getCrystals error:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des cristaux' });
  }
}

/**
 * GET /api/crystals/:id
 */
async function getCrystalById(req, res) {
  try {
    const crystal = await crystalService.getCrystalById(req.params.id);
    if (!crystal) return res.status(404).json({ error: 'Cristal non trouvé' });
    res.json(crystal);
  } catch (err) {
    console.error('getCrystalById error:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération du cristal' });
  }
}

/**
 * GET /api/crystals/slug/:slug
 */
async function getCrystalBySlug(req, res) {
  try {
    const crystal = await crystalService.getCrystalBySlug(req.params.slug);
    if (!crystal) return res.status(404).json({ error: 'Cristal non trouvé' });
    res.json(crystal);
  } catch (err) {
    console.error('getCrystalBySlug error:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération du cristal' });
  }
}

/**
 * POST /api/crystals
 */
async function createCrystal(req, res) {
  try {
    const { name, color } = req.body;
    if (!name || !color) {
      return res.status(400).json({ error: 'Les champs name et color sont requis' });
    }
    // Générer le slug depuis le nom
    if (!req.body.slug) {
      req.body.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    const crystal = await crystalService.createCrystal(req.body);
    res.status(201).json(crystal);
  } catch (err) {
    console.error('createCrystal error:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Un cristal avec ce nom ou slug existe déjà' });
    }
    res.status(500).json({ error: 'Erreur lors de la création du cristal' });
  }
}

/**
 * PUT /api/crystals/:id
 */
async function updateCrystal(req, res) {
  try {
    const crystal = await crystalService.updateCrystal(req.params.id, req.body);
    res.json(crystal);
  } catch (err) {
    console.error('updateCrystal error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Cristal non trouvé' });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour du cristal' });
  }
}

/**
 * DELETE /api/crystals/:id
 */
async function deleteCrystal(req, res) {
  try {
    await crystalService.deleteCrystal(req.params.id);
    res.json({ message: 'Cristal supprimé avec succès' });
  } catch (err) {
    console.error('deleteCrystal error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Cristal non trouvé' });
    }
    res.status(500).json({ error: 'Erreur lors de la suppression du cristal' });
  }
}

/**
 * PUT /api/crystals/:id/stock
 */
async function updateStock(req, res) {
  try {
    const stock = await crystalService.updateStock(req.params.id, req.body);
    res.json(stock);
  } catch (err) {
    console.error('updateStock error:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du stock' });
  }
}

/**
 * POST /api/crystals/suggest
 * Suggestions pour création artisanale
 */
async function suggestForCreation(req, res) {
  try {
    const crystals = await crystalService.suggestForCreation(req.body);
    res.json(crystals);
  } catch (err) {
    console.error('suggestForCreation error:', err);
    res.status(500).json({ error: 'Erreur lors de la suggestion de cristaux' });
  }
}

/**
 * POST /api/crystals/research
 * Recherche automatique (Wikipedia + Gemini) ou semi-automatique (URLs + Gemini)
 */
async function researchCrystal(req, res) {
  try {
    const { name, mode, urls } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Le nom du cristal est requis' });
    }

    let data;
    if (mode === 'semi-auto') {
      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: 'Au moins une URL est requise pour le mode semi-automatique' });
      }
      data = await researchService.researchCrystalWithSources(name, urls);
    } else {
      data = await researchService.researchCrystalAuto(name);
    }

    res.json(data);
  } catch (err) {
    console.error('researchCrystal error:', err);
    let message = err.message || 'Erreur lors de la recherche';
    if (message.includes('429') || message.includes('Too Many Requests') || message.includes('quota')) {
      message = 'Quota Gemini dépassé ou API non activée. Vérifiez que l\'API "Generative Language" est bien activée dans Google Cloud Console pour votre clé.';
    } else if (message.includes('403') || message.includes('API key')) {
      message = 'Clé API Gemini invalide ou non autorisée. Vérifiez votre clé dans le fichier .env.';
    }
    res.status(500).json({ error: message });
  }
}

/**
 * POST /api/crystals/generate
 * Endpoint IA simulé (MVP)
 */
async function generateWithAI(req, res) {
  try {
    const { objective, creationType, mood } = req.body;

    // Simulation d'une réponse IA pour le MVP
    const suggestions = [
      {
        crystal: 'Améthyste',
        reason: `Idéale pour ${objective || 'la paix intérieure'} - favorise la clarté mentale et la sérénité`,
        energyLevel: 'haute'
      },
      {
        crystal: 'Quartz Rose',
        reason: 'Apporte amour et douceur, parfait pour équilibrer les émotions',
        energyLevel: 'douce'
      },
      {
        crystal: 'Lapis Lazuli',
        reason: 'Stimule la sagesse et la communication, excellent pour la méditation',
        energyLevel: 'moyenne'
      }
    ];

    res.json({
      suggestions,
      message: `Sélection IA pour "${creationType || 'votre création'}" axée sur ${objective || 'le bien-être'}`,
      note: 'Réponse simulée - intégration IA complète à venir'
    });
  } catch (err) {
    console.error('generateWithAI error:', err);
    res.status(500).json({ error: 'Erreur lors de la génération IA' });
  }
}

module.exports = {
  getCrystals,
  getCrystalById,
  getCrystalBySlug,
  createCrystal,
  updateCrystal,
  deleteCrystal,
  updateStock,
  suggestForCreation,
  generateWithAI,
  researchCrystal
};
