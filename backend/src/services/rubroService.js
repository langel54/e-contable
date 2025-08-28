const prisma = require("../config/database");

const rubroService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const rubros = await prisma.rubro.findMany({
      // skip,
      // take: limit,
      select: {
        nrubro: true,
        idrubro: true,
      },
    });

    const total = await prisma.rubro.count();
    return { rubros, total };
  },

  // Obtener un registro por su número de rubro
  async getByNro(nrubro) {
    //"ALIMENTOS"
    return await prisma.rubro.findUnique({
      where: { nrubro },
      select: {
        nrubro: true,
        idrubro: true,
        cliente_prov: true, // Relación con ClienteProv
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.rubro.create({
      data,
      select: {
        nrubro: true,
        idrubro: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(nrubro, data) {
    const rubro = await prisma.rubro.findUnique({
      where: { nrubro },
    });
    if (!rubro) return null;

    return await prisma.rubro.update({
      where: { nrubro },
      data,
      select: {
        nrubro: true,
        idrubro: true,
      },
    });
  },

  // Eliminar un registro
  async delete(nrubro) {
    const rubro = await prisma.rubro.findUnique({
      where: { nrubro },
    });
    if (!rubro) return null;

    return await prisma.rubro.delete({ where: { nrubro } });
  },
};

module.exports = rubroService;
