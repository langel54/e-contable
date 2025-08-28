const prisma = require("../config/database");

const salidaService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
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
    });

    const total = await prisma.salida.count();
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

  // Eliminar un registro
  async delete(idsalida) {
    const salida = await prisma.salida.findUnique({ where: { idsalida } });
    if (!salida) return null;

    return await prisma.salida.delete({ where: { idsalida } });
  },
};

module.exports = salidaService;
