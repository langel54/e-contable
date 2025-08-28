const prisma = require("../config/database");

const notasService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const notas = await prisma.notas.findMany({
      skip,
      take: limit,
      select: {
        idnotas: true,
        n_fecha: true,
        idclienteprov: true,
        contenido: true,
        fecha_ed: true,
        ncreador: true,
        neditor: true,
      },
    });

    const total = await prisma.notas.count();
    return { notas, total };
  },

  // Obtener un registro por su ID
  async getById(idnotas) {
    return await prisma.notas.findUnique({
      where: { idnotas },
      select: {
        idnotas: true,
        n_fecha: true,
        idclienteprov: true,
        contenido: true,
        fecha_ed: true,
        ncreador: true,
        neditor: true,
      },
    });
  },

  // Crear un nuevo registro
  async create(data) {
    return await prisma.notas.create({
      data,
      select: {
        idnotas: true,
        n_fecha: true,
        idclienteprov: true,
        contenido: true,
        fecha_ed: true,
        ncreador: true,
        neditor: true,
      },
    });
  },

  // Actualizar un registro existente
  async update(idnotas, data) {
    const nota = await prisma.notas.findUnique({ where: { idnotas } });
    if (!nota) return null;

    return await prisma.notas.update({
      where: { idnotas },
      data,
      select: {
        idnotas: true,
        n_fecha: true,
        idclienteprov: true,
        contenido: true,
        fecha_ed: true,
        ncreador: true,
        neditor: true,
      },
    });
  },

  // Eliminar un registro
  async delete(idnotas) {
    const nota = await prisma.notas.findUnique({ where: { idnotas } });
    if (!nota) return null;

    return await prisma.notas.delete({ where: { idnotas } });
  },
};

module.exports = notasService;
