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

  async getFilter(skip, limit, idclienteprov, idtipo_trib, anio, mes, estado) {
    const whereConditions = {
      AND: [],
    };

    if (idclienteprov) {
      whereConditions.AND.push({ idclienteprov });
    }

    if (idtipo_trib) {
      whereConditions.AND.push({ idtipo_trib });
    }

    if (anio) {
      whereConditions.AND.push({ anio });
    }

    if (mes) {
      whereConditions.AND.push({ mes });
    }

    if (estado) {
      whereConditions.AND.push({ estado });
    }

    const [tributos, total] = await Promise.all([
      prisma.tributos.findMany({
        skip,
        take: Number(limit),
        where: whereConditions,
        include: {
          cliente_prov: true,
          tipo_trib: true,
        },
        orderBy: {
          idtributos: "desc",
        },
      }),
      prisma.tributos.count({
        where: whereConditions,
      }),
    ]);

    return { tributos, total };
  },
};

module.exports = tributosService;
