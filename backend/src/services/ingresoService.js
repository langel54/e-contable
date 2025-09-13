const prisma = require("../config/database");

const ingresoService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit, startDate, endDate, concept, period, year, status) {
    const whereConditions = {
      AND: [],
    };

    if (startDate && endDate) {
      whereConditions.AND.push({
        fecha: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      });
    }
    if (concept) {
      whereConditions.AND.push({ idconcepto: concept });
    }
    if (period && year) {
      whereConditions.AND.push({
        idperiodo: period,
        anio: year,
      });
    }
    if (status) {
      whereConditions.AND.push({
        idestado: status,
      });
    }

    const ingresos = await prisma.ingreso.findMany({
      skip,
      take: limit,

      select: {
        idingreso: true,
        fecha: true,
        idtipo_op: true,
        idtipo_doc: true,
        serie_doc: true,
        num_doc: true,
        idclienteprov: true,
        idconcepto: true,
        idperiodo: true,
        anio: true,
        importe: true,
        idestado: true,
        observacion: true,
        registra: true,
        codcaja_m: true,
        cliente_prov: {
          select: { idclienteprov: true, razonsocial: true },
        },
        concepto: {
          select: { idconcepto: true, nombre_concepto: true },
        },
        periodo: {
          select: { idperiodo: true, nom_periodo: true },
        },
        tipo_doc: {
          select: { idtipo_doc: true, descripcion: true },
        },
        tipo_op: {
          select: { idtipo_op: true, nombre_op: true },
        },
        estado: {
          select: { idestado: true, nom_estado: true },
        },
        caja_mes: {
          select: { codcaja_m: true, saldo_mes: true },
        },
      },
      where: whereConditions,
      orderBy: {
        idingreso: "desc",
      },
    });

    const total = await prisma.ingreso.count({ where: whereConditions });
    return { ingresos, total };
  },

  // Obtener un registro por su ID
  async getById(idingreso) {
    return await prisma.ingreso.findUnique({
      where: { idingreso },
      select: {
        idingreso: true,
        fecha: true,
        idtipo_op: true,
        idtipo_doc: true,
        serie_doc: true,
        num_doc: true,
        idclienteprov: true,
        idconcepto: true,
        idperiodo: true,
        anio: true,
        importe: true,
        idestado: true,
        observacion: true,
        registra: true,
        codcaja_m: true,
        cliente_prov: {
          select: { idclienteprov: true, razonsocial: true },
        },
        concepto: true,
        periodo: true,
        tipo_doc: true,
        tipo_op: true,
        estado: true,
        caja_mes: true,
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.ingreso.create({
      data,
      select: {
        idingreso: true,
        fecha: true,
        idtipo_op: true,
        idtipo_doc: true,
        serie_doc: true,
        num_doc: true,
        idclienteprov: true,
        idconcepto: true,
        idperiodo: true,
        anio: true,
        importe: true,
        idestado: true,
        observacion: true,
        registra: true,
        codcaja_m: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(idingreso, data) {
    const ingreso = await prisma.ingreso.findUnique({ where: { idingreso } });
    if (!ingreso) return null;
    return await prisma.ingreso.update({
      where: { idingreso },
      data: {
        fecha: data.fecha,
        idtipo_op: data.idtipo_op,
        idtipo_doc: data.idtipo_doc,
        serie_doc: data.serie_doc,
        num_doc: data.num_doc,
        idclienteprov: data.idclienteprov,
        idconcepto: data.idconcepto,
        idperiodo: data.idperiodo,
        anio: data.anio,
        importe: data.importe,
        idestado: data.idestado,
        observacion: data.observacion,
        registra: data.registra,
        codcaja_m: data.codcaja_m,
      },
      select: {
        idingreso: true,
        fecha: true,
        idtipo_op: true,
        idtipo_doc: true,
        serie_doc: true,
        num_doc: true,
        idclienteprov: true,
        idconcepto: true,
        idperiodo: true,
        anio: true,
        importe: true,
        idestado: true,
        observacion: true,
        registra: true,
        codcaja_m: true,
      },
    });
  },

  // Eliminar un registro
  // async delete(idingreso) {
  //   const ingreso = await prisma.ingreso.findUnique({ where: { idingreso } });
  //   if (!ingreso) return null;

  //   return await prisma.ingreso.delete({ where: { idingreso } });
  // },
  async delete(idingreso) {
    const ingreso = await prisma.ingreso.findUnique({ where: { idingreso } });
    if (!ingreso) return null;

    return await prisma.ingreso.update({
      where: { idingreso },
      data: { estado: { connect: { idestado: 2 } } },
    });
  },
};

module.exports = ingresoService;
