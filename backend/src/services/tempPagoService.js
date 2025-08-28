const prisma = require("../config/database");

const tmpService = {
  async getAll(skip, limit) {
    const [tmps, total] = await Promise.all([
      prisma.tmp.findMany({
        skip,
        take: Number(limit),
        orderBy: {
          fecha_p: "desc",
        },
      }),
      prisma.tmp.count(),
    ]);

    return { tmps, total };
  },

  async getBySession(sessionId) {
    return prisma.tmp.findMany({
      where: {
        session_id: sessionId,
      },
      orderBy: {
        fecha_p: "desc",
      },
    });
  },

  async create(data) {
    // Asegurar que la fecha sea un objeto Date válido
    data.fecha_p = new Date(data.fecha_p);

    // Redondear el importe a 2 decimales
    if (data.importe_p) {
      data.importe_p = Math.round(data.importe_p * 100) / 100;
    }

    return prisma.tmp.create({
      data: {
        fecha_p: data.fecha_p,
        importe_p: data.importe_p,
        idforma_pago_trib: data.idforma_pago_trib,
        detalles: data.detalles,
        session_id: data.session_id,
      },
    });
  },

  async update(id, data) {
    // Convertir fecha si se proporciona
    if (data.fecha_p) {
      data.fecha_p = new Date(data.fecha_p);
    }

    // Redondear el importe si se proporciona
    if (data.importe_p) {
      data.importe_p = Math.round(data.importe_p * 100) / 100;
    }

    return prisma.tmp.update({
      where: { idtmp: id },
      data,
    });
  },

  async delete(id) {
    return prisma.tmp.delete({
      where: { idtmp: id },
    });
  },

  async deleteBySession(sessionId) {
    return prisma.tmp.deleteMany({
      where: {
        session_id: sessionId,
      },
    });
  },

  // Método útil para limpiar registros temporales antiguos
  async cleanOldRecords(hoursOld = 24) {
    const cutoffDate = new Date(Date.now() - hoursOld * 60 * 60 * 1000);

    return prisma.tmp.deleteMany({
      where: {
        fecha_p: {
          lt: cutoffDate,
        },
      },
    });
  },
};

module.exports = tmpService;
