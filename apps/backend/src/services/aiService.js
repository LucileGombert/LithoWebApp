const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../lib/prisma');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Génère une sélection de cristaux adaptée à une intention via Gemini.
 * Les cristaux suggérés sont issus de la base de données (IDs réels).
 */
async function generateCrystalSelection({ creationType, objective, color }) {
  const crystals = await prisma.crystal.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      virtues: true,
      properties: true,
      chakras: { select: { name: true } },
    },
    orderBy: { name: 'asc' },
  });

  if (crystals.length === 0) {
    throw new Error('Aucun cristal disponible dans la base de données');
  }

  const catalogText = crystals.map(c => {
    const virtues = c.virtues?.slice(0, 4).join(', ') || '';
    const chakras = c.chakras?.map(ch => ch.name).join(', ') || '';
    return `ID:${c.id} | ${c.name} | couleur:${c.color} | vertus:${virtues} | chakras:${chakras}`;
  }).join('\n');

  const context = [
    creationType ? `Type de création : ${creationType}` : null,
    objective ? `Intention / objectif : ${objective}` : 'Intention : bien-être général',
    color ? `Couleur préférée : ${color}` : null,
  ].filter(Boolean).join('\n');

  const prompt = `Tu es un expert en lithothérapie. Un artisan souhaite créer une composition de cristaux.

${context}

Voici les cristaux disponibles dans sa collection (format : ID | nom | couleur | vertus | chakras) :
${catalogText}

Sélectionne 3 à 5 cristaux parmi cette liste qui formeraient une combinaison harmonieuse et efficace pour l'intention demandée. Tiens compte des synergies entre pierres, de leurs chakras et de la cohérence énergétique.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans backticks) :
{
  "message": "Présentation de ta recommandation en 1-2 phrases (naturelle, experte)",
  "suggestions": [
    {
      "crystalId": <id_exact_de_la_liste>,
      "crystalName": "<nom_exact_de_la_liste>",
      "reason": "Raison courte et précise (1 phrase, axée sur l'apport pour l'intention)"
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/^```json\n?/i, '').replace(/```$/i, '').trim();
    data = JSON.parse(cleaned);
  }

  // Valider que les IDs correspondent à de vrais cristaux
  const idSet = new Set(crystals.map(c => c.id));
  const validSuggestions = (data.suggestions || []).filter(s => idSet.has(s.crystalId));

  return {
    message: data.message,
    suggestions: validSuggestions,
  };
}

module.exports = { generateCrystalSelection };
