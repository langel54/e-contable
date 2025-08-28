const prisma = require("../config/database");

const pagosService = {
  async getAll(skip, limit) {
    const [pagos, total] = await Promise.all([
      prisma.pagos.findMany({
        skip,
        take: Number(limit),
        orderBy: {
          fecha_p: "desc",
        },
      }),
      prisma.pagos.count(),
    ]);

    return { pagos, total };
  },

  async getById(id) {
    return prisma.pagos.findUnique({
      where: { idpagos: id },
    });
  },

  async getByTributo(idtributos) {
    return prisma.pagos.findMany({
      where: { idtributos },
      orderBy: {
        fecha_p: "desc",
      },
    });
  },

  async create(data) {
    // Asegurarse de que la fecha de pago sea un objeto Date válido
    if (data.fecha_p) {
      data.fecha_p = new Date(data.fecha_p);
    } else {
      data.fecha_p = new Date(); // Fecha actual si no se proporciona
    }

    // Crear el pago
    const pago = await prisma.pagos.create({
      data,
    });

    // Actualizar el importe pagado en el tributo correspondiente
    await this.actualizarImportePagadoTributo(data.idtributos);

    return pago;
  },

  async update(id, data) {
    // Asegurarse de que la fecha de pago sea un objeto Date válido
    if (data.fecha_p) {
      data.fecha_p = new Date(data.fecha_p);
    }

    const pago = await prisma.pagos.update({
      where: { idpagos: id },
      data,
    });

    // Si se actualizó el importe, actualizar el total pagado del tributo
    if (data.importe_p) {
      await this.actualizarImportePagadoTributo(pago.idtributos);
    }

    return pago;
  },

  async delete(id) {
    const pago = await prisma.pagos.delete({
      where: { idpagos: id },
    });

    // Actualizar el importe pagado en el tributo después de eliminar el pago
    await this.actualizarImportePagadoTributo(pago.idtributos);

    return pago;
  },

  // Método auxiliar para actualizar el importe pagado en el tributo
  async actualizarImportePagadoTributo(idtributos) {
    // Calcular el total de pagos para el tributo
    const totalPagado = await prisma.pagos.aggregate({
      where: { idtributos },
      _sum: {
        importe_p: true,
      },
    });

    // Actualizar el importe pagado en el tributo
    await prisma.tributos.update({
      where: { idtributos },
      data: {
        importe_pag: totalPagado._sum.importe_p || 0,
      },
    });
  },
};

module.exports = pagosService;
