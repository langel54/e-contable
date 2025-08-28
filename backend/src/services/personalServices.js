const prisma = require("../config/database");

const personalService = {
  // Obtener todos los registros con paginación
  async getAllPersonals(skip, limit) {
    const personals = await prisma.personal.findMany({
      skip,
      take: Number(limit),
      select: {
        id_personal: true,
        nombres: true,
        apellidos: true,
        direccion: true,
        telefono: true,
      },
    });

    const total = await prisma.personal.count();
    return { personals, total };
  },

  // Obtener un registro por ID
  async getPersonalById(id) {
    return await prisma.personal.findUnique({
      where: { id_personal: id },
      select: {
        id_personal: true,
        nombres: true,
        apellidos: true,
        direccion: true,
        telefono: true,
        usuario: {
          select: {
            id_usuario: true,
            usuario: true,
          },
        },
      },
    });
  },

  // Crear un nuevo registro
  async createPersonal(data) {
    return await prisma.personal.create({
      data,
      select: {
        id_personal: true,
        nombres: true,
        apellidos: true,
        direccion: true,
        telefono: true,
      },
    });
  },

  // Actualizar un registro existente
  async updatePersonal(id, data) {
    const personal = await prisma.personal.findUnique({
      where: { id_personal: id },
    });
    if (!personal) return null;

    return await prisma.personal.update({
      where: { id_personal: id },
      data,
      select: {
        id_personal: true,
        nombres: true,
        apellidos: true,
        direccion: true,
        telefono: true,
      },
    });
  },

  // Eliminar un registro
  async deletePersonal(id) {
    const personal = await prisma.personal.findUnique({
      where: { id_personal: id },
    });
    if (!personal) return null;

    return await prisma.personal.delete({
      where: { id_personal: id },
    });
  },
};

module.exports = personalService;
