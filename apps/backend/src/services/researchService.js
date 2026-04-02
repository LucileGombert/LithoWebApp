const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Récupère le résumé Wikipedia (FR puis EN) pour un cristal
 */
async function fetchWikipediaContent(crystalName) {
  const frUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(crystalName)}`;
  const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(crystalName)}`;

  let content = '';

  try {
    const frRes = await fetch(frUrl);
    if (frRes.ok) {
      const frData = await frRes.json();
      if (frData.extract) {
        content += `Source: Wikipedia FR\n${frData.extract}\n\n`;
      }
    }
  } catch (_) {}

  try {
    const enRes = await fetch(enUrl);
    if (enRes.ok) {
      const enData = await enRes.json();
      if (enData.extract) {
        content += `Source: Wikipedia EN\n${enData.extract}\n\n`;
      }
    }
  } catch (_) {}

  return content;
}

/**
 * Récupère et nettoie le contenu texte d'une URL externe
 */
async function fetchUrlContent(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LithoApp/1.0 Crystal Research Bot' },
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return null;

    const html = await res.text();
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 6000);

    return text || null;
  } catch (_) {
    return null;
  }
}

/**
 * Prompt commun pour l'extraction structurée des données du cristal
 */
function buildExtractionPrompt(crystalName, sources) {
  return `Tu es un expert en lithothérapie et en minéralogie. Analyse les sources suivantes sur le cristal "${crystalName}" et extrais les informations structurées.

SOURCES:
${sources}

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans backticks) respectant cette structure exacte:
{
  "name": "${crystalName}",
  "color": "#COULEUR_HEX_PRINCIPALE",
  "colors": ["couleur1", "couleur2"],
  "description": "Description détaillée en français (2-4 phrases sur les propriétés lithothérapeutiques)",
  "virtues": ["Vertu1", "Vertu2", "Vertu3"],
  "properties": ["Propriété1", "Propriété2"],
  "hardness": 7.0,
  "origin": "Pays ou région d'origine principale",
  "chakras": ["Nom du chakra"],
  "zodiacSigns": ["Signe1", "Signe2"],
  "precautions": ["Précaution si applicable"]
}

Règles strictes:
- color: couleur hex principale (ex: "#9B59B6" pour violet)
- colors: liste de noms de couleurs en français (ex: "violet", "blanc", "rose pâle")
- virtues: 5 à 8 bénéfices courts et concis (ex: "Protection", "Sérénité", "Clarté mentale")
- properties: 3 à 5 propriétés générales (ex: "Pierre de protection", "Cristal de méditation")
- hardness: échelle de Mohs (nombre décimal, ex: 7.0)
- chakras: utilise UNIQUEMENT ces valeurs: Racine, Sacré, Plexus Solaire, Cœur, Gorge, Troisième Œil, Couronne
- zodiacSigns: noms français des signes zodiacaux (ex: Bélier, Taureau, Gémeaux, Cancer, Lion, Vierge, Balance, Scorpion, Sagittaire, Capricorne, Verseau, Poissons)
- precautions: tableau vide [] si aucune précaution
- Si une information est inconnue, utilise null pour les champs scalaires ou [] pour les tableaux`;
}

/**
 * Mode automatique : Wikipedia + Gemini
 */
async function researchCrystalAuto(crystalName) {
  const sources = await fetchWikipediaContent(crystalName);

  if (!sources.trim()) {
    throw new Error(`Aucune information trouvée sur Wikipedia pour "${crystalName}"`);
  }

  const prompt = buildExtractionPrompt(crystalName, sources);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    return JSON.parse(text);
  } catch {
    // Tentative de nettoyage si Gemini a ajouté des backticks malgré la consigne
    const cleaned = text.replace(/^```json\n?/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleaned);
  }
}

/**
 * Mode semi-automatique : URLs fournies + Gemini
 */
async function researchCrystalWithSources(crystalName, urls) {
  let sources = '';

  for (const url of urls) {
    const content = await fetchUrlContent(url);
    if (content) {
      sources += `\nSource: ${url}\n${content}\n\n---\n`;
    }
  }

  if (!sources.trim()) {
    throw new Error('Impossible de récupérer le contenu des URLs fournies. Vérifiez les liens et réessayez.');
  }

  const prompt = buildExtractionPrompt(crystalName, sources);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```json\n?/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleaned);
  }
}

module.exports = { researchCrystalAuto, researchCrystalWithSources };
