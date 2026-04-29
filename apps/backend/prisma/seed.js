const prisma = require('../src/lib/prisma');

async function main() {
  console.log('🌱 Début du seeding...');

  // Chakras (7 chakras principaux)
  const chakras = await Promise.all([
    prisma.chakra.upsert({ where: { name: 'Racine' }, update: {}, create: { name: 'Racine', color: '#FF0000', position: 1, description: 'Ancrage, sécurité, survie' } }),
    prisma.chakra.upsert({ where: { name: 'Sacré' }, update: {}, create: { name: 'Sacré', color: '#FF7F00', position: 2, description: 'Créativité, sexualité, émotions' } }),
    prisma.chakra.upsert({ where: { name: 'Plexus Solaire' }, update: {}, create: { name: 'Plexus Solaire', color: '#FFFF00', position: 3, description: 'Pouvoir personnel, confiance en soi' } }),
    prisma.chakra.upsert({ where: { name: 'Cœur' }, update: {}, create: { name: 'Cœur', color: '#00FF00', position: 4, description: 'Amour, compassion, guérison' } }),
    prisma.chakra.upsert({ where: { name: 'Gorge' }, update: {}, create: { name: 'Gorge', color: '#00FFFF', position: 5, description: 'Communication, expression, vérité' } }),
    prisma.chakra.upsert({ where: { name: 'Troisième Œil' }, update: {}, create: { name: 'Troisième Œil', color: '#0000FF', position: 6, description: 'Intuition, perception, sagesse' } }),
    prisma.chakra.upsert({ where: { name: 'Couronne' }, update: {}, create: { name: 'Couronne', color: '#8B00FF', position: 7, description: 'Spiritualité, connexion divine' } }),
  ]);

  // Signes du zodiaque
  const zodiacs = await Promise.all([
    prisma.zodiacSign.upsert({ where: { name: 'Bélier' }, update: {}, create: { name: 'Bélier', symbol: '♈', element: 'Feu' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Taureau' }, update: {}, create: { name: 'Taureau', symbol: '♉', element: 'Terre' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Gémeaux' }, update: {}, create: { name: 'Gémeaux', symbol: '♊', element: 'Air' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Cancer' }, update: {}, create: { name: 'Cancer', symbol: '♋', element: 'Eau' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Lion' }, update: {}, create: { name: 'Lion', symbol: '♌', element: 'Feu' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Vierge' }, update: {}, create: { name: 'Vierge', symbol: '♍', element: 'Terre' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Balance' }, update: {}, create: { name: 'Balance', symbol: '♎', element: 'Air' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Scorpion' }, update: {}, create: { name: 'Scorpion', symbol: '♏', element: 'Eau' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Sagittaire' }, update: {}, create: { name: 'Sagittaire', symbol: '♐', element: 'Feu' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Capricorne' }, update: {}, create: { name: 'Capricorne', symbol: '♑', element: 'Terre' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Verseau' }, update: {}, create: { name: 'Verseau', symbol: '♒', element: 'Air' } }),
    prisma.zodiacSign.upsert({ where: { name: 'Poissons' }, update: {}, create: { name: 'Poissons', symbol: '♓', element: 'Eau' } }),
  ]);

  // Types de création artisanale
  const creationTypes = await Promise.all([
    prisma.creationType.upsert({ where: { name: 'Bijoux' }, update: { icon: '📿' }, create: { name: 'Bijoux', description: 'Bijoux ornés de cristaux naturels', icon: '📿' } }),
    prisma.creationType.upsert({ where: { name: 'Porte-clé' }, update: { icon: '🗝️' }, create: { name: 'Porte-clé', description: 'Porte-clé avec cristaux', icon: '🗝️' } }),
    prisma.creationType.upsert({ where: { name: 'Marque page' }, update: { icon: '🔖' }, create: { name: 'Marque page', description: 'Marque-page décoré de cristaux', icon: '🔖' } }),
    prisma.creationType.upsert({ where: { name: 'Bougie' }, update: { icon: '🕯️' }, create: { name: 'Bougie', description: 'Bougie ornée de cristaux', icon: '🕯️' } }),
    prisma.creationType.upsert({ where: { name: 'Décoration' }, update: { icon: '🪶' }, create: { name: 'Décoration', description: 'Objet décoratif', icon: '🪶' } }),
    prisma.creationType.upsert({ where: { name: 'Elixir' }, update: { icon: '✨' }, create: { name: 'Elixir', description: 'Élixir aux huiles végétales et cristaux', icon: '✨' } }),
  ]);

  // Précautions communes
  const precautionEau = await prisma.precaution.upsert({
    where: { id: 1 }, update: { description: 'Ne pas mettre en contact avec l\'eau (soluble ou fragile)' },
    create: { description: 'Ne pas mettre en contact avec l\'eau (soluble ou fragile)' }
  });
  const precautionSoleil = await prisma.precaution.upsert({
    where: { id: 2 }, update: { description: 'Éviter l\'exposition prolongée au soleil (peut se décolorer)' },
    create: { description: 'Éviter l\'exposition prolongée au soleil (peut se décolorer)' }
  });
 

  // ===== CRISTAUX =====
  const crystalsData = [
    {
      name: 'Améthyste',
      slug: 'amethyste',
      color: '#9B59B6',
      colors: ['violet', 'purple', 'lavande'],
      description: 'Pierre de sagesse et de paix intérieure, l\'améthyste favorise la clarté mentale, la méditation et protège des énergies négatives.',
      virtues: ['paix', 'sagesse', 'protection', 'méditation', 'intuition', 'clarté mentale'],
      properties: ['apaisante', 'protectrice', 'spirituelle', 'purifiante'],
      hardness: 7,
      origin: 'Brésil, Uruguay, Afrique du Sud',
      chakraNames: ['Troisième Œil', 'Couronne'],
      zodiacNames: ['Poissons', 'Verseau', 'Vierge'],
      precautionIds: [2], // décoloration soleil
      stock: { perlesCailloux: 50, perles4mm: 30, perles6mm: 20, pierresRoulees: 15, pierresBrutes: 8, perles2mm: 0 }
    },
    {
      name: 'Quartz Rose',
      slug: 'quartz-rose',
      color: '#FFB6C1',
      colors: ['rose', 'pink', 'pastel'],
      description: 'Pierre de l\'amour universel et de la compassion, le quartz rose ouvre le chakra du cœur et favorise l\'harmonie dans les relations.',
      virtues: ['amour', 'compassion', 'douceur', 'guérison émotionnelle', 'confiance', 'paix'],
      properties: ['douce', 'apaisante', 'émotionnelle', 'harmonisante'],
      hardness: 7,
      origin: 'Brésil, Madagascar, Inde',
      chakraNames: ['Cœur'],
      zodiacNames: ['Taureau', 'Balance', 'Cancer'],
      stock: { perlesCailloux: 80, perles4mm: 50, perles6mm: 35, pierresRoulees: 25, pierresBrutes: 10, perles2mm: 20 }
    },
    {
      name: 'Lapis Lazuli',
      slug: 'lapis-lazuli',
      color: '#26619C',
      colors: ['bleu', 'blue', 'indigo', 'doré'],
      description: 'Pierre de sagesse et de vérité, le lapis lazuli stimule l\'intellect et la communication tout en ouvrant le troisième œil.',
      virtues: ['sagesse', 'vérité', 'communication', 'intuition', 'intelligence', 'connaissance'],
      properties: ['intellectuelle', 'spirituelle', 'communicative', 'protectrice'],
      hardness: 5.5,
      origin: 'Afghanistan, Chili, Russie',
      chakraNames: ['Troisième Œil', 'Gorge'],
      zodiacNames: ['Sagittaire', 'Balance', 'Verseau'],
      precautionIds: [1], // eau
      stock: { perlesCailloux: 30, perles4mm: 20, perles6mm: 10, pierresRoulees: 8, pierresBrutes: 5, perles2mm: 0 }
    },
    {
      name: 'Citrine',
      slug: 'citrine',
      color: '#F7C948',
      colors: ['jaune', 'yellow', 'orange', 'doré'],
      description: 'Pierre de la joie et de l\'abondance, la citrine attire la prospérité, booste la confiance en soi et apporte une énergie positive.',
      virtues: ['joie', 'abondance', 'prospérité', 'confiance', 'optimisme', 'créativité', 'motivation'],
      properties: ['énergisante', 'positive', 'stimulante', 'purifiante'],
      hardness: 7,
      origin: 'Brésil, Madagascar, Espagne',
      chakraNames: ['Plexus Solaire', 'Sacré'],
      zodiacNames: ['Lion', 'Gémeaux', 'Bélier', 'Balance'],
      precautionIds: [2], // soleil
      stock: { perlesCailloux: 60, perles4mm: 40, perles6mm: 25, pierresRoulees: 20, pierresBrutes: 12, perles2mm: 15 }
    },
    {
      name: 'Obsidienne Noire',
      slug: 'obsidienne-noire',
      color: '#1a1a1a',
      colors: ['noir', 'black', 'gris foncé'],
      description: 'Pierre de protection puissante, l\'obsidienne noire absorbe les énergies négatives et favorise l\'ancrage et la transformation.',
      virtues: ['protection', 'ancrage', 'transformation', 'purification', 'vérité', 'force'],
      properties: ['protectrice', 'ancrante', 'purifiante', 'transformatrice'],
      hardness: 5.5,
      origin: 'Mexique, USA, Islande',
      chakraNames: ['Racine'],
      zodiacNames: ['Scorpion', 'Sagittaire'],
      precautionIds: [], // aucune précaution spéciale
      stock: { perlesCailloux: 40, perles4mm: 25, perles6mm: 15, pierresRoulees: 20, pierresBrutes: 10, perles2mm: 0 }
    },
    {
      name: 'Malachite',
      slug: 'malachite',
      color: '#2ECC71',
      colors: ['vert', 'green', 'emeraude'],
      description: 'Pierre de transformation et d\'abondance, la malachite absorbe les énergies négatives et stimule la croissance personnelle.',
      virtues: ['transformation', 'abondance', 'protection', 'croissance', 'équilibre', 'guérison'],
      properties: ['transformatrice', 'protectrice', 'équilibrante', 'régénératrice'],
      hardness: 3.5,
      origin: 'Congo, Russie, Zambie',
      chakraNames: ['Cœur', 'Plexus Solaire'],
      zodiacNames: ['Scorpion', 'Capricorne', 'Taureau'],
      precautionIds: [1], // eau (contient du cuivre)
      stock: { perlesCailloux: 25, perles4mm: 15, perles6mm: 8, pierresRoulees: 10, pierresBrutes: 5, perles2mm: 0 }
    },
    {
      name: 'Labradorite',
      slug: 'labradorite',
      color: '#708090',
      colors: ['gris', 'gray', 'bleu', 'irisé', 'multicolore'],
      description: 'Pierre de magie et de transformation, la labradorite révèle le monde de la magie et renforce les pouvoirs psychiques.',
      virtues: ['magie', 'intuition', 'protection', 'transformation', 'créativité', 'synchronicité'],
      properties: ['mystique', 'protectrice', 'intuitive', 'transformatrice'],
      hardness: 6,
      origin: 'Canada, Finlande, Madagascar',
      chakraNames: ['Troisième Œil', 'Gorge', 'Couronne'],
      zodiacNames: ['Lion', 'Scorpion', 'Sagittaire'],
      stock: { perlesCailloux: 35, perles4mm: 20, perles6mm: 12, pierresRoulees: 15, pierresBrutes: 7, perles2mm: 0 }
    },
    {
      name: 'Pierre de Lune',
      slug: 'pierre-de-lune',
      color: '#E8E8FF',
      colors: ['blanc', 'white', 'bleuté', 'irisé', 'nacré'],
      description: 'Pierre du féminin sacré et des cycles lunaires, elle renforce l\'intuition et favorise la connexion avec les émotions profondes.',
      virtues: ['intuition', 'féminin', 'cycles', 'sensibilité', 'rêves', 'empathie', 'renouveau'],
      properties: ['intuitive', 'douce', 'lunaire', 'émotionnelle'],
      hardness: 6,
      origin: 'Sri Lanka, Inde, Madagascar',
      chakraNames: ['Sacré', 'Troisième Œil', 'Couronne'],
      zodiacNames: ['Cancer', 'Balance', 'Scorpion'],
      precautionIds: [1], // eau
      stock: { perlesCailloux: 20, perles4mm: 15, perles6mm: 8, pierresRoulees: 10, pierresBrutes: 3, perles2mm: 0 }
    },
    {
      name: 'Œil de Tigre',
      slug: 'oeil-de-tigre',
      color: '#C8860A',
      colors: ['marron', 'brown', 'doré', 'orange'],
      description: 'Pierre de protection et de courage, l\'œil de tigre favorise la confiance en soi, la détermination et aide à prendre des décisions claires.',
      virtues: ['courage', 'confiance', 'protection', 'détermination', 'clarté', 'volonté', 'force'],
      properties: ['protectrice', 'dynamisante', 'ancrante', 'clarifiante'],
      hardness: 7,
      origin: 'Afrique du Sud, Australie, Inde',
      chakraNames: ['Plexus Solaire', 'Racine', 'Sacré'],
      zodiacNames: ['Lion', 'Capricorne', 'Gémeaux'],
      stock: { perlesCailloux: 55, perles4mm: 35, perles6mm: 22, pierresRoulees: 18, pierresBrutes: 0, perles2mm: 10 }
    },
    {
      name: 'Tourmaline Noire',
      slug: 'tourmaline-noire',
      color: '#2C2C2C',
      colors: ['noir', 'black'],
      description: 'La tourmaline noire est l\'une des meilleures pierres de protection. Elle crée un bouclier énergétique et purifie l\'environnement.',
      virtues: ['protection', 'purification', 'ancrage', 'neutralisation', 'équilibre', 'sécurité'],
      properties: ['protectrice', 'purifiante', 'ancrante', 'équilibrante'],
      hardness: 7.5,
      origin: 'Brésil, Pakistan, USA',
      chakraNames: ['Racine'],
      zodiacNames: ['Capricorne', 'Scorpion'],
      stock: { perlesCailloux: 45, perles4mm: 28, perles6mm: 16, pierresRoulees: 20, pierresBrutes: 12, perles2mm: 0 }
    },
    {
      name: 'Aventurine Verte',
      slug: 'aventurine-verte',
      color: '#4CAF50',
      colors: ['vert', 'green', 'jade'],
      description: 'Pierre de la chance et de la croissance, l\'aventurine attire la chance, favorise l\'optimisme et stimule la croissance personnelle.',
      virtues: ['chance', 'croissance', 'optimisme', 'prospérité', 'équilibre', 'leadership'],
      properties: ['positive', 'équilibrante', 'régénératrice', 'dynamisante'],
      hardness: 7,
      origin: 'Inde, Brésil, Russie',
      chakraNames: ['Cœur'],
      zodiacNames: ['Taureau', 'Vierge', 'Cancer'],
      stock: { perlesCailloux: 70, perles4mm: 45, perles6mm: 30, pierresRoulees: 22, pierresBrutes: 5, perles2mm: 20 }
    },
    {
      name: 'Sodalite',
      slug: 'sodalite',
      color: '#1A3A7A',
      colors: ['bleu', 'blue', 'blanc', 'foncé'],
      description: 'Pierre de la logique et de la vérité, la sodalite renforce la pensée rationnelle, la communication et l\'estime de soi.',
      virtues: ['logique', 'vérité', 'communication', 'confiance', 'clarté', 'équilibre émotionnel'],
      properties: ['intellectuelle', 'apaisante', 'équilibrante', 'communicative'],
      hardness: 5.5,
      origin: 'Canada, Brésil, Namibie',
      chakraNames: ['Troisième Œil', 'Gorge'],
      zodiacNames: ['Sagittaire', 'Verseau'],
      stock: { perlesCailloux: 40, perles4mm: 25, perles6mm: 14, pierresRoulees: 12, pierresBrutes: 6, perles2mm: 8 }
    }
  ];

  // Créer les cristaux
  const createdCrystals = [];
  for (const crystalData of crystalsData) {
    const { chakraNames, zodiacNames, precautionIds, stock, ...data } = crystalData;

    // Trouver les IDs des chakras
    const chakraConnects = chakraNames
      ? chakras.filter(c => chakraNames.includes(c.name)).map(c => ({ id: c.id }))
      : [];

    // Trouver les IDs des zodiacs
    const zodiacConnects = zodiacNames
      ? zodiacs.filter(z => zodiacNames.includes(z.name)).map(z => ({ id: z.id }))
      : [];

    // Précautions
    const precautionConnects = (precautionIds || []).map(id => ({ id }));

    const crystal = await prisma.crystal.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        chakras: { connect: chakraConnects },
        zodiacSigns: { connect: zodiacConnects },
        precautions: precautionConnects.length > 0 ? { connect: precautionConnects } : undefined,
        // Associer tous les types de création
        creationTypes: { connect: creationTypes.map(ct => ({ id: ct.id })) },
        stock: { create: stock }
      }
    });
    createdCrystals.push(crystal);
    console.log(`  ✅ ${crystal.name} créé`);
  }

  // Définir quelques compatibilités / incompatibilités
  // Améthyste compatible avec Quartz Rose, Lapis Lazuli
  const amethyste = createdCrystals.find(c => c.slug === 'amethyste');
  const quartzRose = createdCrystals.find(c => c.slug === 'quartz-rose');
  const lapisLazuli = createdCrystals.find(c => c.slug === 'lapis-lazuli');
  const citrine = createdCrystals.find(c => c.slug === 'citrine');
  const obsidienne = createdCrystals.find(c => c.slug === 'obsidienne-noire');
  const tourmalineNoire = createdCrystals.find(c => c.slug === 'tourmaline-noire');
  const malachite = createdCrystals.find(c => c.slug === 'malachite');

  // Compatibilités
  await prisma.crystal.update({
    where: { id: amethyste.id },
    data: { compatibleWith: { connect: [{ id: quartzRose.id }, { id: lapisLazuli.id }] } }
  });

  await prisma.crystal.update({
    where: { id: citrine.id },
    data: { compatibleWith: { connect: [{ id: amethyste.id }] } }
  });

  // Incompatibilités (énergie contradictoire)
  await prisma.crystal.update({
    where: { id: citrine.id },
    data: { incompatibleWith: { connect: [{ id: obsidienne.id }] } }
  });

  await prisma.crystal.update({
    where: { id: amethyste.id },
    data: { incompatibleWith: { connect: [{ id: malachite.id }] } }
  });

  console.log('\n✨ Seeding terminé avec succès !');
  console.log(`   ${createdCrystals.length} cristaux insérés`);
  console.log(`   ${chakras.length} chakras insérés`);
  console.log(`   ${zodiacs.length} signes zodiacaux insérés`);
  console.log(`   ${creationTypes.length} types de création insérés`);
}

main()
  .catch(e => {
    console.error('❌ Erreur seeding:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
