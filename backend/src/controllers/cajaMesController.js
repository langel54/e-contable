const cajaMesService = require("../services/cajaMesService");

const cajaMesController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { cajasMensuales, total } = await cajaMesService.getAll(
        skip,
        Number(limit)
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
};

module.exports = cajaMesController;
