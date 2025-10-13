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
    const tributo = await prisma.tributos.findUnique({
      where: { idtributos: id },
      include: {
        cliente_prov: true,
        tipo_trib: true,
      },
    });
    if (!tributo) {
      const error = new Error("Tributo no encontrado");
      error.type = "not_found";
      throw error;
    }
    return tributo;
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
    // Validación de campos obligatorios
    if (!data.idclienteprov) {
      const error = new Error("El campo 'idclienteprov' es obligatorio.");
      error.type = "validation";
      throw error;
    }
    if (!data.idtipo_trib) {
      const error = new Error("El campo 'idtipo_trib' es obligatorio.");
      error.type = "validation";
      throw error;
    }
    if (!data.anio) {
      const error = new Error("El campo 'anio' es obligatorio.");
      error.type = "validation";
      throw error;
    }
    if (!data.mes) {
      const error = new Error("El campo 'mes' es obligatorio.");
      error.type = "validation";
      throw error;
    }
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
    // Validar existencia
    const tributo = await prisma.tributos.findUnique({ where: { idtributos: id } });
    if (!tributo) {
      const error = new Error("Tributo no encontrado");
      error.type = "not_found";
      throw error;
    }
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

  async checkPagosAsociados(id) {
    const pagosCount = await prisma.pagos.count({
      where: { idtributos: id },
    });
    return pagosCount > 0;
  },

  async delete(id, force = false) {
    // Verificar si el tributo existe
    const tributo = await prisma.tributos.findUnique({ where: { idtributos: id } });
    if (!tributo) {
      const error = new Error("Tributo no encontrado");
      error.type = "not_found";
      throw error;
    }

    if (!force) {
      // Verificar si tiene pagos asociados
      const tienePagos = await this.checkPagosAsociados(id);
      if (tienePagos) {
        const error = new Error("No se puede eliminar el tributo porque tiene pagos asociados. Use la opción de eliminación forzada si desea continuar.");
        error.type = "forbidden";
        throw error;
      }

      // Si el tributo tiene un importe pagado, no permitir la eliminación
      if (tributo.importe_pc > 0) {
        const error = new Error("No se puede eliminar el tributo porque ya tiene pagos registrados. Use la opción de eliminación forzada si desea continuar.");
        error.type = "forbidden";
        throw error;
      }
    } else {
      // Si es forzado, eliminar primero los pagos asociados
      await prisma.pagos.deleteMany({
        where: { idtributos: id },
      });
    }

    // Si todo está bien o se fuerza la eliminación, proceder
    await prisma.tributos.delete({
      where: { idtributos: id },
    });

    return { success: true, message: "Tributo y pagos asociados eliminados correctamente" };
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
