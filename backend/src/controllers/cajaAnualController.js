const cajaAnualService = require("../services/cajaAnualService");

const cajaAnualController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const { page, limit } = req.query;
      const pageInt = parseInt(page) || 1;
      const limitInt = parseInt(limit) || 10;
      const skip = (pageInt - 1) * limitInt;

      const { cajasAnuales, total } = await cajaAnualService.getAll(
        skip,
        limitInt
      );

      res.json({
        cajasAnuales,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener un registro por su código
  async getByCod(req, res) {
    const { codcaja_a } = req.params;
    try {
      const cajaAnual = await cajaAnualService.getByCod(codcaja_a);
      if (!cajaAnual) {
        return res.status(404).json({ message: "Caja Anual no encontrada" });
      }
      res.json(cajaAnual);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    try {
      const prisma = require("../config/database");

      // 1. Validar si ya existe una caja anual abierta
      const openCaja = await prisma.cajaAnual.findFirst({
        where: {
          OR: [
            { estado_c_a: "1" },
            { estado_c_a: "ABIERTO" }
          ]
        }
      });

      if (openCaja) {
        return res.status(400).json({
          message: `No se puede abrir una nueva caja anual porque la caja ${openCaja.codcaja_a} aún está ABIERTA. Debe cerrarla primero.`
        });
      }

      // 2. Normalizar código (asegurar prefijo 'S')
      let data = req.body;
      if (data.codcaja_a && !data.codcaja_a.startsWith("S")) {
        data.codcaja_a = "S" + data.codcaja_a;
      }

      const nuevoCajaAnual = await cajaAnualService.create(data);
      res.status(201).json(nuevoCajaAnual);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { codcaja_a } = req.params;
    try {
      const cajaAnualActualizada = await cajaAnualService.update(
        codcaja_a,
        req.body
      );
      if (!cajaAnualActualizada) {
        return res.status(404).json({ message: "Caja Anual no encontrada" });
      }
      res.json(cajaAnualActualizada);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { codcaja_a } = req.params;
    try {
      const deleted = await cajaAnualService.delete(codcaja_a);
      if (!deleted) {
        return res.status(404).json({ message: "Caja Anual no encontrada" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async close(req, res) {
    const { codcaja_a } = req.params;
    try {
      const result = await cajaAnualService.closeCaja(codcaja_a);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getLastBalance(req, res) {
    const { year } = req.query; // Esperamos el CODIGO DEL AÑO actual para buscar el anterior
    try {
      const result = await cajaAnualService.getLastBalance(year);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = cajaAnualController;
