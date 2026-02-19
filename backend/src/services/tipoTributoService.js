const prisma = require("../config/database");

const tipoTribService = {
  async getAll(skip, limit) {
    const tipoTribs = await prisma.tipoTrib.findMany({
      skip,
      take: limit,
      select: {
        idtipo_trib: true,
        descripcion_t: true,
      },
      orderBy: {
        idtipo_trib: "asc",
      },
    });

    const total = await prisma.tipoTrib.count();
    return { tipoTribs, total };
  },

  async getById(id) {
    return await prisma.tipoTrib.findUnique({
      where: { idtipo_trib: id },
      select: {
        idtipo_trib: true,
        descripcion_t: true,
        tributos: true,
      },
    });
  },

  async create(data) {
    return await prisma.tipoTrib.create({
      data,
      select: {
        idtipo_trib: true,
        descripcion_t: true,
      },
    });
  },

  async update(id, data) {
    const tipoTrib = await prisma.tipoTrib.findUnique({
      where: { idtipo_trib: id },
    });
    if (!tipoTrib) return null;

    return await prisma.tipoTrib.update({
      where: { idtipo_trib: id },
      data,
      select: {
        idtipo_trib: true,
        descripcion_t: true,
      },
    });
  },

  async delete(id) {
    const tipoTrib = await prisma.tipoTrib.findUnique({
      where: { idtipo_trib: id },
    });
    if (!tipoTrib) return null;

    return await prisma.tipoTrib.delete({ where: { idtipo_trib: id } });
  },
};

module.exports = tipoTribService;
