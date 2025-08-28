const prisma = require("../config/database");

const conceptoService = {
  async getAll(skip, limit) {
    const conceptos = await prisma.concepto.findMany({
      skip,
      take: limit,
      select: {
        idconcepto: true,
        nombre_concepto: true,
      },
    });

    const total = await prisma.concepto.count();
    return { conceptos, total };
  },

  async getById(id) {
    return await prisma.concepto.findUnique({
      where: { idconcepto: id },
      select: {
        idconcepto: true,
        nombre_concepto: true,
        // ingreso: true,
        // salida: true,
      },
    });
  },

  async create(data) {
    return await prisma.concepto.create({
      data,
      select: {
        idconcepto: true,
        nombre_concepto: true,
      },
    });
  },

  async update(id, data) {
    const concepto = await prisma.concepto.findUnique({
      where: { idconcepto: id },
    });
    if (!concepto) return null;

    return await prisma.concepto.update({
      where: { idconcepto: id },
      data,
      select: {
        idconcepto: true,
        nombre_concepto: true,
      },
    });
  },

  async delete(id) {
    const concepto = await prisma.concepto.findUnique({
      where: { idconcepto: id },
    });
    if (!concepto) return null;

    return await prisma.concepto.delete({ where: { idconcepto: id } });
  },
};

module.exports = conceptoService;
