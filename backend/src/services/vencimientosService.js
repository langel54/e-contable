const prisma = require("../config/database");

const vencimientosService = {
  async getAll(skip, limit) {
    const [vencimientos, total] = await Promise.all([
      prisma.vencimientos.findMany({
        skip,
        take: Number(limit),
        orderBy: [{ anio_v: "desc" }, { mes_v: "desc" }],
      }),
      prisma.vencimientos.count(),
    ]);

    return { vencimientos, total };
  },

  async getById(id) {
    return prisma.vencimientos.findUnique({
      where: { idvencimientos: id },
    });
  },

  async getByPeriodo(anio, mes) {
    return prisma.vencimientos.findFirst({
      where: {
        anio_v: anio,
        mes_v: mes,
      },
    });
  },

  async create(data) {
    // Convertir todas las fechas a objetos Date
    const dateFields = [
      "d0",
      "d1",
      "d2",
      "d3",
      "d4",
      "d5",
      "d6",
      "d7",
      "d8",
      "d9",
    ];
    dateFields.forEach((field) => {
      if (data[field]) {
        data[field] = new Date(data[field]);
      }
    });

    // Asegurar que mes_v tenga siempre 2 dígitos
    if (data.mes_v && data.mes_v.length === 1) {
      data.mes_v = `0${data.mes_v}`;
    }

    return prisma.vencimientos.create({
      data,
    });
  },

  async update(id, data) {
    // Convertir todas las fechas a objetos Date
    const dateFields = [
      "d0",
      "d1",
      "d2",
      "d3",
      "d4",
      "d5",
      "d6",
      "d7",
      "d8",
      "d9",
    ];
    dateFields.forEach((field) => {
      if (data[field]) {
        data[field] = new Date(data[field]);
      }
    });

    // Asegurar que mes_v tenga siempre 2 dígitos
    if (data.mes_v && data.mes_v.length === 1) {
      data.mes_v = `0${data.mes_v}`;
    }

    return prisma.vencimientos.update({
      where: { idvencimientos: id },
      data,
    });
  },

  async delete(id) {
    return prisma.vencimientos.delete({
      where: { idvencimientos: id },
    });
  },

  async validateDates(data) {
    // Validar formato de año
    if (data.anio_v && !/^\d{4}$/.test(data.anio_v)) {
      return "El año debe tener 4 dígitos";
    }

    // Validar formato de mes
    if (data.mes_v && !/^(0?[1-9]|1[0-2])$/.test(data.mes_v)) {
      return "El mes debe estar entre 1 y 12";
    }

    // Validar que las fechas estén en orden cronológico
    const dateFields = [
      "d0",
      "d1",
      "d2",
      "d3",
      "d4",
      "d5",
      "d6",
      "d7",
      "d8",
      "d9",
    ];
    let previousDate = null;

    for (const field of dateFields) {
      if (data[field]) {
        const currentDate = new Date(data[field]);
        if (previousDate && currentDate < previousDate) {
          return `La fecha ${field} debe ser posterior a la fecha anterior`;
        }
        previousDate = currentDate;
      }
    }

    return null;
  },
};

module.exports = vencimientosService;
