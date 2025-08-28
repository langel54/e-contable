const prisma = require("../config/database");

const tipoDocumentoService = {
  async getAll(skip, limit) {
    const [tipoDocumentos, total] = await Promise.all([
      prisma.tipoDocumento.findMany({
        // skip,
        // take: Number(limit),
        orderBy: {
          idtipo_doc: "asc",
        },
        include: {
          _count: {
            select: {
              ingreso: true,
              salida: true,
            },
          },
        },
      }),
      prisma.tipoDocumento.count(),
    ]);

    return {
      tipoDocumentos: tipoDocumentos.map((doc) => ({
        ...doc,
        documentosAsociados: doc._count.ingreso + doc._count.salida,
        _count: undefined,
      })),
      total,
    };
  },

  async getById(id) {
    return prisma.tipoDocumento
      .findUnique({
        where: { idtipo_doc: id },
        include: {
          _count: {
            select: {
              ingreso: true,
              salida: true,
            },
          },
        },
      })
      .then((doc) => {
        if (doc) {
          return {
            ...doc,
            documentosAsociados: doc._count.ingreso + doc._count.salida,
            _count: undefined,
          };
        }
        return null;
      });
  },

  async create(data) {
    if (!data.descripcion) {
      throw new Error("La descripción es requerida");
    }

    return prisma.tipoDocumento.create({
      data: {
        idtipo_doc: data.idtipo_doc,
        descripcion: data.descripcion,
      },
    });
  },

  async update(id, data) {
    if (data.descripcion === "") {
      throw new Error("La descripción no puede estar vacía");
    }

    return prisma.tipoDocumento.update({
      where: { idtipo_doc: id },
      data: {
        descripcion: data.descripcion,
      },
    });
  },

  async delete(id) {
    // Verificar si hay documentos asociados antes de eliminar
    const documentosAsociados = await prisma.tipoDocumento.findUnique({
      where: { idtipo_doc: id },
      include: {
        _count: {
          select: {
            ingreso: true,
            salida: true,
          },
        },
      },
    });

    if (
      documentosAsociados._count.ingreso > 0 ||
      documentosAsociados._count.salida > 0
    ) {
      throw new Error(
        "No se puede eliminar el tipo de documento porque tiene documentos asociados"
      );
    }

    return prisma.tipoDocumento.delete({
      where: { idtipo_doc: id },
    });
  },
};

module.exports = tipoDocumentoService;
