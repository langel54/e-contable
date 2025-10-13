const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get vencimientos by filters (anio, mes, u_digito)
const getVencimientosByFilters = async (anio, mes, u_digito) => {
  // Validar el último dígito
  if (isNaN(u_digito) || u_digito < 0 || u_digito > 9) {
    const error = new Error("El último dígito debe estar entre 0 y 9");
    error.type = "validation";
    throw error;
  }

  // Buscar el registro de vencimientos para ese año y mes
  const registro = await prisma.vencimientos.findFirst({
    where: {
      anio_v: anio,
      mes_v: mes,
    },
  });

  if (!registro) {
    const error = new Error(`No se encontraron vencimientos para ${mes}/${anio}`);
    error.type = "not_found";
    throw error;
  }

  // Obtener la fecha correspondiente al último dígito
  const campoFecha = `d${u_digito}`;
  const fechaVencimiento = registro[campoFecha];

  if (!fechaVencimiento) {
    const error = new Error(`No hay fecha definida para el dígito ${u_digito}`);
    error.type = "not_found";
    throw error;
  }

  return {
    anio,
    mes,
    u_digito,
    fecha_vencimiento: fechaVencimiento,
  };
};

// Get all vencimientos with pagination
const getAllVencimientos = async (limit = 10, offset = 0) => {
  try {
    const [vencimientos, total] = await Promise.all([
      prisma.vencimientos.findMany({
        take: limit,
        skip: offset,
        orderBy: [{ anio_v: "desc" }, { mes_v: "desc" }],
      }),
      prisma.vencimientos.count(),
    ]);

    return {
      vencimientos,
      total,
    };
  } catch (error) {
    console.error("Error en getAllVencimientos:", error);
    throw error;
  }
};

// Get vencimiento by ID
const getVencimientoById = async (id) => {
  try {
    const vencimiento = await prisma.vencimientos.findUnique({
      where: {
        idvencimientos: parseInt(id),
      },
    });

    return vencimiento;
  } catch (error) {
    console.error("Error en getVencimientoById:", error);
    throw error;
  }
};

// Create vencimiento
const createVencimiento = async (vencimientoData) => {
  try {
    const vencimiento = await prisma.vencimientos.create({
      data: {
        d0: new Date(vencimientoData.d0),
        d1: new Date(vencimientoData.d1),
        d2: new Date(vencimientoData.d2),
        d3: new Date(vencimientoData.d3),
        d4: new Date(vencimientoData.d4),
        d5: new Date(vencimientoData.d5),
        d6: new Date(vencimientoData.d6),
        d7: new Date(vencimientoData.d7),
        d8: new Date(vencimientoData.d8),
        d9: new Date(vencimientoData.d9),
        anio_v: vencimientoData.anio_v,
        mes_v: vencimientoData.mes_v,
      },
    });

    return vencimiento;
  } catch (error) {
    console.error("Error en createVencimiento:", error);
    throw error;
  }
};

// Update vencimiento
const updateVencimiento = async (id, vencimientoData) => {
  try {
    const vencimiento = await prisma.vencimientos.update({
      where: {
        idvencimientos: parseInt(id),
      },
      data: {
        d0: vencimientoData.d0 ? new Date(vencimientoData.d0) : undefined,
        d1: vencimientoData.d1 ? new Date(vencimientoData.d1) : undefined,
        d2: vencimientoData.d2 ? new Date(vencimientoData.d2) : undefined,
        d3: vencimientoData.d3 ? new Date(vencimientoData.d3) : undefined,
        d4: vencimientoData.d4 ? new Date(vencimientoData.d4) : undefined,
        d5: vencimientoData.d5 ? new Date(vencimientoData.d5) : undefined,
        d6: vencimientoData.d6 ? new Date(vencimientoData.d6) : undefined,
        d7: vencimientoData.d7 ? new Date(vencimientoData.d7) : undefined,
        d8: vencimientoData.d8 ? new Date(vencimientoData.d8) : undefined,
        d9: vencimientoData.d9 ? new Date(vencimientoData.d9) : undefined,
        anio_v: vencimientoData.anio_v,
        mes_v: vencimientoData.mes_v,
      },
    });

    return vencimiento;
  } catch (error) {
    console.error("Error en updateVencimiento:", error);
    throw error;
  }
};

// Delete vencimiento
const deleteVencimiento = async (id) => {
  try {
    const vencimiento = await prisma.vencimientos.delete({
      where: {
        idvencimientos: parseInt(id),
      },
    });

    return vencimiento;
  } catch (error) {
    console.error("Error en deleteVencimiento:", error);
    throw error;
  }
};

module.exports = {
  getVencimientosByFilters,
  getAllVencimientos,
  getVencimientoById,
  createVencimiento,
  updateVencimiento,
  deleteVencimiento,
};
