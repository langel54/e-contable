const prisma = require("../config/database");

const notasService = {
  // Obtener todos los registros con paginación
  async getAll(skip, limit) {
    const notas = await prisma.notas.findMany({
      skip,
      take: limit,
      orderBy: { n_fecha: "desc" },
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
    const nota = await prisma.notas.findUnique({
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
    if (!nota) {
      const error = new Error("Nota no encontrada");
      error.type = "not_found";
      throw error;
    }
    return nota;
  },

  // Crear un nuevo registro
  async create(data) {
    if (!data.contenido || !data.ncreador) {
      const error = new Error("El contenido y el nombre del creador son obligatorios.");
      error.type = "validation";
      throw error;
    }
    const now = new Date();
    return await prisma.notas.create({
      data: {
        ...data,
        n_fecha: now,
        fecha_ed: now,
        neditor: data.ncreador,
      },
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
    if (!nota) {
      const error = new Error("Nota no encontrada");
      error.type = "not_found";
      throw error;
    }
    if (!data.contenido || !data.neditor) {
      const error = new Error("El contenido y el nombre del editor son obligatorios.");
      error.type = "validation";
      throw error;
    }
    return await prisma.notas.update({
      where: { idnotas },
      data: {
        contenido: data.contenido,
        fecha_ed: new Date(),
        neditor: data.neditor,
      },
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
    if (!nota) {
      const error = new Error("Nota no encontrada");
      error.type = "not_found";
      throw error;
    }
    return await prisma.notas.delete({ where: { idnotas } });
  },
};

module.exports = notasService;
