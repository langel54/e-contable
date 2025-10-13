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
    // obtenemos los pagos
    const pagos = await prisma.pagos.findMany({
      where: { idtributos },
      orderBy: { fecha_p: "desc" },
      select: {
        idpagos: true,
        idtributos: true,
        fecha_p: true,
        importe_p: true,
        idforma_pago_trib: true,
        detalles: true,
      },
    });

    if (!pagos.length) return [];

    // obtenemos todos los IDs únicos de forma de pago usados
    const idsFormasPago = [...new Set(pagos.map((p) => p.idforma_pago_trib))];

    // consultamos sus descripciones
    const formasPago = await prisma.formaPagoTrib.findMany({
      where: { idforma_pago_trib: { in: idsFormasPago } },
      select: { idforma_pago_trib: true, descripcion: true },
    });

    // las convertimos en un diccionario para acceso rápido
    const mapaFormasPago = Object.fromEntries(
      formasPago.map((fp) => [fp.idforma_pago_trib, fp.descripcion])
    );

    // combinamos la información
    return pagos.map((p) => ({
      ...p,
      descripcion_forma_pago: mapaFormasPago[p.idforma_pago_trib] || null,
    }));
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

  // Método auxiliar para actualizar el importe pagado y pendiente en el tributo
  async actualizarImportePagadoTributo(idtributos) {
    // Calcular el total de pagos para el tributo
    const totalPagado = await prisma.pagos.aggregate({
      where: { idtributos },
      _sum: {
        importe_p: true,
      },
    });

    // Obtener el tributo para calcular el pendiente y el estado
    const tributo = await prisma.tributos.findUnique({
      where: { idtributos },
      select: { importe_reg: true },
    });

    const pagado = parseFloat(totalPagado._sum.importe_p) || 0;
    const importeReg = parseFloat(tributo?.importe_reg) || 0;
    const pendiente = importeReg > 0 ? Math.max(importeReg - pagado, 0) : 0;

    // Estado: '1' si pagado >= importe_reg, '0' en caso contrario
    const estado = pagado >= importeReg && importeReg > 0 ? "1" : "0";

    // Actualizar el importe pagado, pendiente y estado en el tributo
    await prisma.tributos.update({
      where: { idtributos },
      data: {
        importe_pc: pagado,
        importe_pend: pendiente,
        estado: estado,
      },
    });
  },
};

module.exports = pagosService;
