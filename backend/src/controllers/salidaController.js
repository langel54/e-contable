const salidaService = require("../services/salidaService");

const salidaController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { salidas, total } = await salidaService.getAll(
        skip,
        Number(limit)
      );

      res.json({
        salidas,
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

  // Obtener un registro por su ID
  async getById(req, res) {
    const { idsalida } = req.params;
    try {
      const salida = await salidaService.getById(Number(idsalida));
      if (!salida) {
        return res.status(404).json({ message: "Salida no encontrada" });
      }
      res.json(salida);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    try {
      const nuevaSalida = await salidaService.create(req.body);
      res.status(201).json(nuevaSalida);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { idsalida } = req.params;
    try {
      const salidaActualizada = await salidaService.update(
        Number(idsalida),
        req.body
      );
      if (!salidaActualizada) {
        return res.status(404).json({ message: "Salida no encontrada" });
      }
      res.json(salidaActualizada);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { idsalida } = req.params;
    try {
      const deleted = await salidaService.delete(Number(idsalida));
      if (!deleted) {
        return res.status(404).json({ message: "Salida no encontrada" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = salidaController;
