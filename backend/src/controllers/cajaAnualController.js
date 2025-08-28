const cajaAnualService = require("../services/cajaAnualService");

const cajaAnualController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { cajasAnuales, total } = await cajaAnualService.getAll(
        skip,
        Number(limit)
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
      const nuevoCajaAnual = await cajaAnualService.create(req.body);
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
};

module.exports = cajaAnualController;
