const prisma = require("../config/database");

const formaPagoTribService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const formaPagoTribs = await prisma.formaPagoTrib.findMany({
      skip,
      take: limit,
      select: {
        idforma_pago_trib: true,
        descripcion: true,
      },
    });

    const total = await prisma.formaPagoTrib.count();
    return { formaPagoTribs, total };
  },

  // Obtener un registro por su ID
  async getById(id) {
    const stringId = toString(id);
    return await prisma.formaPagoTrib.findUnique({
      where: { idforma_pago_trib: id },
      select: {
        idforma_pago_trib: true,
        descripcion: true,
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.formaPagoTrib.create({
      data,
      select: {
        idforma_pago_trib: true,
        descripcion: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(id, data) {
    const formaPagoTrib = await prisma.formaPagoTrib.findUnique({
      where: { idforma_pago_trib: id },
    });
    if (!formaPagoTrib) return null;

    return await prisma.formaPagoTrib.update({
      where: { idforma_pago_trib: id },
      data,
      select: {
        idforma_pago_trib: true,
        descripcion: true,
      },
    });
  },

  // Eliminar un registro
  async delete(id) {
    const formaPagoTrib = await prisma.formaPagoTrib.findUnique({
      where: { idforma_pago_trib: id },
    });
    if (!formaPagoTrib) return null;

    return await prisma.formaPagoTrib.delete({
      where: { idforma_pago_trib: id },
    });
  },
};

module.exports = formaPagoTribService;
