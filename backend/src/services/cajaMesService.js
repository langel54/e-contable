const prisma = require("../config/database");

const cajaMesService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const cajasMensuales = await prisma.cajaMes.findMany({
      // skip,
      // take: limit,
      select: {
        nro: true,
        codcaja_m: true,
        fecha_apertura: true,
        monto_inicial_m: true,
        ingreso_mes: true,
        salida_mes: true,
        saldo_mes: true,
        fechacierre: true,
        codcaja_a: true,
        registra: true,
        estado_c_m: true,
        caja_anual: true, // Relación con CajaAnual
      },
      orderBy: {
        nro: "desc",
      },
    });

    const total = await prisma.cajaMes.count();
    return { cajasMensuales, total };
  },

  // Obtener un registro por su código
  async getByCod(codcaja_m) {
    return await prisma.cajaMes.findUnique({
      where: { codcaja_m },
      select: {
        codcaja_m: true,
        fecha_apertura: true,
        monto_inicial_m: true,
        ingreso_mes: true,
        salida_mes: true,
        saldo_mes: true,
        fechacierre: true,
        codcaja_a: true,
        registra: true,
        estado_c_m: true,
        caja_anual: true, // Relación con CajaAnual
        ingreso: true, // Relación con Ingreso
        salida: true, // Relación con Salida
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.cajaMes.create({
      data,
      select: {
        codcaja_m: true,
        fecha_apertura: true,
        monto_inicial_m: true,
        ingreso_mes: true,
        salida_mes: true,
        saldo_mes: true,
        fechacierre: true,
        codcaja_a: true,
        registra: true,
        estado_c_m: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(codcaja_m, data) {
    const cajaMes = await prisma.cajaMes.findUnique({
      where: { codcaja_m },
    });
    if (!cajaMes) return null;

    return await prisma.cajaMes.update({
      where: { codcaja_m },
      data,
      select: {
        codcaja_m: true,
        fecha_apertura: true,
        monto_inicial_m: true,
        ingreso_mes: true,
        salida_mes: true,
        saldo_mes: true,
        fechacierre: true,
        codcaja_a: true,
        registra: true,
        estado_c_m: true,
      },
    });
  },

  // Eliminar un registro
  async delete(codcaja_m) {
    const cajaMes = await prisma.cajaMes.findUnique({
      where: { codcaja_m },
    });
    if (!cajaMes) return null;

    return await prisma.cajaMes.delete({ where: { codcaja_m } });
  },
};

module.exports = cajaMesService;
