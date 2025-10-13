const prisma = require("../config/database");

const salidaService = {
  // Obtener todos los registros con paginación y filtros
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
      whereConditions.AND.push({ idestado: status });
    }
    const salidas = await prisma.salida.findMany({
      skip,
      take: limit,
      select: {
        idsalida: true,
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
        idsalida: "desc",
      },
    });
    const total = await prisma.salida.count({ where: whereConditions });
    return { salidas, total };
  },

  // Obtener un registro por su ID
  async getById(idsalida) {
    return await prisma.salida.findUnique({
      where: { idsalida },
      select: {
        idsalida: true,
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
        cliente_prov: true,
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
    return await prisma.salida.create({
      data,
      select: {
        idsalida: true,
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
  async update(idsalida, data) {
    const salida = await prisma.salida.findUnique({ where: { idsalida } });
    if (!salida) return null;
    return await prisma.salida.update({
      where: { idsalida },
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
        idsalida: true,
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
  // Eliminar un registro (lógico)
  async delete(idsalida) {
    const salida = await prisma.salida.findUnique({ where: { idsalida } });
    if (!salida) return null;
    return await prisma.salida.update({
      where: { idsalida },
      data: { estado: { connect: { idestado: 2 } } },
    });
  },
};

module.exports = salidaService;
