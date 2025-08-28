const prisma = require("../config/database");

const configuracionService = {
  async getAll(skip, limit) {
    const [configuraciones, total] = await Promise.all([
      prisma.configuracion.findMany({
        skip,
        take: Number(limit),
        orderBy: {
          idconfig: "desc",
        },
      }),
      prisma.configuracion.count(),
    ]);

    return { configuraciones, total };
  },

  async getCurrentConfig() {
    // Obtener la configuración más reciente
    return prisma.configuracion.findFirst({
      orderBy: {
        idconfig: "desc",
      },
    });
  },

  async getById(id) {
    return prisma.configuracion.findUnique({
      where: { idconfig: id },
    });
  },

  async create(data) {
    // Redondear IGV y TIM a 2 decimales
    if (data.igv) {
      data.igv = Math.round(data.igv * 100) / 100;
    }
    if (data.tim) {
      data.tim = Math.round(data.tim * 100) / 100;
    }

    return prisma.configuracion.create({
      data,
    });
  },

  async update(id, data) {
    // Redondear IGV y TIM a 2 decimales si se proporcionan
    if (data.igv) {
      data.igv = Math.round(data.igv * 100) / 100;
    }
    if (data.tim) {
      data.tim = Math.round(data.tim * 100) / 100;
    }

    return prisma.configuracion.update({
      where: { idconfig: id },
      data,
    });
  },

  async delete(id) {
    return prisma.configuracion.delete({
      where: { idconfig: id },
    });
  },
};

module.exports = configuracionService;
