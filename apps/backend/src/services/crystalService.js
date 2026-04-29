const prisma = require('../lib/prisma');

// Inclure les relations standard pour les réponses
const crystalIncludes = {
  chakras: true,
  zodiacSigns: true,
  precautions: true,
  creationTypes: true,
  stock: true,
  compatibleWith: {
    select: { id: true, name: true, slug: true, color: true, imageUrl: true }
  },
  incompatibleWith: {
    select: { id: true, name: true, slug: true, color: true, imageUrl: true }
  }
};

/**
 * Récupérer tous les cristaux avec filtres optionnels
 */
async function getAllCrystals({ search, color, chakra, zodiac, virtue } = {}) {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { virtues: { has: search } }
    ];
  }

  if (color) {
    where.OR = [
      ...(where.OR || []),
      { color: { contains: color, mode: 'insensitive' } },
      { colors: { has: color } }
    ];
  }

  if (chakra) {
    where.chakras = {
      some: {
        name: { contains: chakra, mode: 'insensitive' }
      }
    };
  }

  if (zodiac) {
    where.zodiacSigns = {
      some: {
        name: { contains: zodiac, mode: 'insensitive' }
      }
    };
  }

  if (virtue) {
    where.virtues = { has: virtue };
  }

  return prisma.crystal.findMany({
    where,
    include: crystalIncludes,
    orderBy: { name: 'asc' }
  });
}

/**
 * Récupérer un cristal par son ID
 */
async function getCrystalById(id) {
  return prisma.crystal.findUnique({
    where: { id: Number(id) },
    include: crystalIncludes
  });
}

/**
 * Récupérer un cristal par son slug
 */
async function getCrystalBySlug(slug) {
  return prisma.crystal.findUnique({
    where: { slug },
    include: crystalIncludes
  });
}

/**
 * Créer un nouveau cristal
 */
async function createCrystal(data) {
  const { chakraIds, zodiacIds, precautions, creationTypeIds, compatibleWithIds, incompatibleWithIds, stock, ...crystalData } = data;

  return prisma.crystal.create({
    data: {
      ...crystalData,
      chakras: chakraIds?.length ? { connect: chakraIds.map(id => ({ id })) } : undefined,
      zodiacSigns: zodiacIds?.length ? { connect: zodiacIds.map(id => ({ id })) } : undefined,
      precautions: precautions?.length ? { create: precautions.map(d => ({ description: d })) } : undefined,
      creationTypes: creationTypeIds?.length ? { connect: creationTypeIds.map(id => ({ id })) } : undefined,
      compatibleWith: compatibleWithIds?.length ? { connect: compatibleWithIds.map(id => ({ id })) } : undefined,
      incompatibleWith: incompatibleWithIds?.length ? { connect: incompatibleWithIds.map(id => ({ id })) } : undefined,
      stock: stock ? { create: stock } : undefined
    },
    include: crystalIncludes
  });
}

/**
 * Mettre à jour un cristal
 */
async function updateCrystal(id, data) {
  const { chakraIds, zodiacIds, precautions, creationTypeIds, compatibleWithIds, incompatibleWithIds, stock, ...crystalData } = data;

  return prisma.crystal.update({
    where: { id: Number(id) },
    data: {
      ...crystalData,
      chakras: chakraIds ? { set: chakraIds.map(id => ({ id })) } : undefined,
      zodiacSigns: zodiacIds ? { set: zodiacIds.map(id => ({ id })) } : undefined,
      precautions: precautions !== undefined
        ? { deleteMany: {}, create: precautions.map(d => ({ description: d })) }
        : undefined,
      creationTypes: creationTypeIds ? { set: creationTypeIds.map(id => ({ id })) } : undefined,
      compatibleWith: compatibleWithIds ? { set: compatibleWithIds.map(id => ({ id })) } : undefined,
      incompatibleWith: incompatibleWithIds ? { set: incompatibleWithIds.map(id => ({ id })) } : undefined,
    },
    include: crystalIncludes
  });
}

/**
 * Supprimer un cristal
 */
async function deleteCrystal(id) {
  return prisma.crystal.delete({
    where: { id: Number(id) }
  });
}

/**
 * Mettre à jour le stock d'un cristal
 */
async function updateStock(crystalId, stockData) {
  return prisma.stock.upsert({
    where: { crystalId: Number(crystalId) },
    update: stockData,
    create: { crystalId: Number(crystalId), ...stockData }
  });
}

/**
 * Suggérer des cristaux pour une création artisanale
 * Filtre par couleur dominante et objectifs (vertus)
 */
async function suggestForCreation({ color, objective, creationTypeId } = {}) {
  const where = {};

  if (color) {
    where.OR = [
      { color: { contains: color, mode: 'insensitive' } },
      { colors: { has: color } }
    ];
  }

  if (objective) {
    const keywords = objective.toLowerCase().split(' ').filter(w => w.length > 3);
    if (keywords.length > 0) {
      where.AND = keywords.map(kw => ({
        OR: [
          { virtues: { has: kw } },
          { properties: { has: kw } },
          { description: { contains: kw, mode: 'insensitive' } }
        ]
      }));
    }
  }

  if (creationTypeId) {
    where.creationTypes = {
      some: { id: Number(creationTypeId) }
    };
  }

  return prisma.crystal.findMany({
    where,
    include: crystalIncludes,
    orderBy: { name: 'asc' }
  });
}

module.exports = {
  getAllCrystals,
  getCrystalById,
  getCrystalBySlug,
  createCrystal,
  updateCrystal,
  deleteCrystal,
  updateStock,
  suggestForCreation
};
