const prisma = require("../config/database");

const tributosService = {
  async getAll(skip, limit) {
    const [tributos, total] = await Promise.all([
      prisma.tributos.findMany({
        skip,
        take: Number(limit),
        include: {
          cliente_prov: true,
          tipo_trib: true,
        },
        orderBy: {
          fecha_v: "desc",
        },
      }),
      prisma.tributos.count(),
    ]);

    return { tributos, total };
  },

  async getById(id) {
    return prisma.tributos.findUnique({
      where: { idtributos: id },
      include: {
        cliente_prov: true,
        tipo_trib: true,
      },
    });
  },

  async getByCliente(idclienteprov) {
    return prisma.tributos.findMany({
      where: { idclienteprov },
      include: {
        tipo_trib: true,
      },
      orderBy: {
        fecha_v: "desc",
      },
    });
  },

  async create(data) {
    // Asegurarse de que la fecha de registro sea un objeto Date válido
    if (data.fecha_reg) {
      data.fecha_reg = new Date(data.fecha_reg);
    }

    return prisma.tributos.create({
      data,
      include: {
        cliente_prov: true,
        tipo_trib: true,
      },
    });
  },

  async update(id, data) {
    // Asegurarse de que la fecha de registro sea un objeto Date válido
    if (data.fecha_reg) {
      data.fecha_reg = new Date(data.fecha_reg);
    }

    return prisma.tributos.update({
      where: { idtributos: id },
      data,
      include: {
        cliente_prov: true,
        tipo_trib: true,
      },
    });
  },

  async delete(id) {
    return prisma.tributos.delete({
      where: { idtributos: id },
    });
  },
};

module.exports = tributosService;
