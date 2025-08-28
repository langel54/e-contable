const prisma = require("../config/database");

const cajaAnualService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const cajasAnuales = await prisma.cajaAnual.findMany({
      skip,
      take: limit,
      select: {
        codcaja_a: true,
        fecha_apertura: true,
        monto_inicial_a: true,
        ingreso_a: true,
        salida_a: true,
        saldo_a: true,
        fechacierre: true,
        registra: true,
        estado_c_a: true,
        caja_mes: true, // Relación con CajaMes
      },
    });

    const total = await prisma.cajaAnual.count();
    return { cajasAnuales, total };
  },

  // Obtener un registro por su código
  async getByCod(codcaja_a) {
    return await prisma.cajaAnual.findUnique({
      where: { codcaja_a },
      select: {
        codcaja_a: true,
        fecha_apertura: true,
        monto_inicial_a: true,
        ingreso_a: true,
        salida_a: true,
        saldo_a: true,
        fechacierre: true,
        registra: true,
        estado_c_a: true,
        caja_mes: true, // Relación con CajaMes
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.cajaAnual.create({
      data,
      select: {
        codcaja_a: true,
        fecha_apertura: true,
        monto_inicial_a: true,
        ingreso_a: true,
        salida_a: true,
        saldo_a: true,
        fechacierre: true,
        registra: true,
        estado_c_a: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(codcaja_a, data) {
    const cajaAnual = await prisma.cajaAnual.findUnique({
      where: { codcaja_a },
    });
    if (!cajaAnual) return null;

    return await prisma.cajaAnual.update({
      where: { codcaja_a },
      data,
      select: {
        codcaja_a: true,
        fecha_apertura: true,
        monto_inicial_a: true,
        ingreso_a: true,
        salida_a: true,
        saldo_a: true,
        fechacierre: true,
        registra: true,
        estado_c_a: true,
      },
    });
  },

  // Eliminar un registro
  async delete(codcaja_a) {
    const cajaAnual = await prisma.cajaAnual.findUnique({
      where: { codcaja_a },
    });
    if (!cajaAnual) return null;

    return await prisma.cajaAnual.delete({ where: { codcaja_a } });
  },
};

module.exports = cajaAnualService;
