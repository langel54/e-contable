const cajaMesService = require("../services/cajaMesService");

const cajaMesController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const { page, limit } = req.query;
      const pageInt = parseInt(page) || 1;
      const limitInt = parseInt(limit) || 10;
      const skip = (pageInt - 1) * limitInt;

      const { cajasMensuales, total } = await cajaMesService.getAll(
        skip,
        limitInt
      );

      res.json({
        cajasMensuales,
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
    const { codcaja_m } = req.params;
    try {
      const cajaMes = await cajaMesService.getByCod(codcaja_m);
      if (!cajaMes) {
        return res.status(404).json({ message: "Caja Mensual no encontrada" });
      }
      res.json(cajaMes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    try {
      const { codcaja_a } = req.body;
      const prisma = require("../config/database");

      // 1. Validar si ya existe una caja mensual abierta (de cualquier año)
      const openCajaMes = await prisma.cajaMes.findFirst({
        where: {
          OR: [
            { estado_c_m: "1" },
            { estado_c_m: "ABIERTO" }
          ]
        }
      });

      if (openCajaMes) {
        return res.status(400).json({
          message: `No se puede abrir una nueva caja mensual porque la caja ${openCajaMes.codcaja_m} aún está ABIERTA. Debe cerrarla primero.`
        });
      }

      // 2. Validar si la caja anual especificada existe y está abierta
      const cajaAnual = await prisma.cajaAnual.findUnique({ where: { codcaja_a } });

      if (!cajaAnual) {
        return res.status(400).json({ message: `La Caja Anual '${codcaja_a}' no existe.` });
      }

      const isAnnualOpen = cajaAnual.estado_c_a === "1" || cajaAnual.estado_c_a === "ABIERTO";
      if (!isAnnualOpen) {
        return res.status(400).json({ message: "No se puede abrir Caja Mensual porque la Caja Anual está Cerrada." });
      }

      const nuevaCajaMes = await cajaMesService.create(req.body);
      res.status(201).json(nuevaCajaMes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { codcaja_m } = req.params;
    try {
      const cajaMesActualizada = await cajaMesService.update(
        codcaja_m,
        req.body
      );
      if (!cajaMesActualizada) {
        return res.status(404).json({ message: "Caja Mensual no encontrada" });
      }
      res.json(cajaMesActualizada);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { codcaja_m } = req.params;
    try {
      const deleted = await cajaMesService.delete(codcaja_m);
      if (!deleted) {
        return res.status(404).json({ message: "Caja Mensual no encontrada" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async close(req, res) {
    const { codcaja_m } = req.params;
    try {
      const result = await cajaMesService.closeCaja(codcaja_m);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getLastBalance(req, res) {
    const { monthCode } = req.query;
    try {
      const result = await cajaMesService.getLastBalance(monthCode);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = cajaMesController;
