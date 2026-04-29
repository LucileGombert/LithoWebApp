const prisma = require('../src/lib/prisma');

const NEW_TYPES = [
  { name: 'Bijoux',      description: 'Bijoux ornés de cristaux naturels',       icon: '📿' },
  { name: 'Porte-clé',  description: 'Porte-clé avec cristaux',                  icon: '🗝️' },
  { name: 'Marque page', description: 'Marque-page décoré de cristaux',           icon: '🔖' },
  { name: 'Bougie',     description: 'Bougie ornée de cristaux',               icon: '🕯️' },
  { name: 'Décoration', description: 'Objet décoratif',               icon: '🪶' },
  { name: 'Elixir',     description: "Élixir d'huiles végétales et de cristaux",     icon: '✨' },
];

const OLD_NAMES = ['Bracelet', 'Collier', 'Grille Cristalline', 'Élixir'];

async function main() {
  // Supprimer les anciens types qui n'existent plus
  for (const name of OLD_NAMES) {
    await prisma.creationType.deleteMany({ where: { name } });
    console.log(`🗑️  Supprimé : ${name}`);
  }

  // Créer ou mettre à jour les nouveaux types
  for (const type of NEW_TYPES) {
    await prisma.creationType.upsert({
      where: { name: type.name },
      update: { description: type.description, icon: type.icon },
      create: type,
    });
    console.log(`✅ Upsert : ${type.icon} ${type.name}`);
  }

  console.log('\n✨ Types de création mis à jour avec succès.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());