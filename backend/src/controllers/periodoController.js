const periodoService = require("../services/periodoService");

const periodoController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    const { skip, limit } = req.query;
    try {
      const { periodos, total } = await periodoService.getAll(
        parseInt(skip) || 0,
        parseInt(limit) || 10
      );
      res.status(200).json({ periodos, total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un registro por su ID
  async getById(req, res) {
    const { idperiodo } = req.params;
    try {
      const periodo = await periodoService.getById(parseInt(idperiodo));
      if (!periodo) {
        return res.status(404).json({ message: "Periodo no encontrado" });
      }
      res.status(200).json(periodo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    const { nom_periodo } = req.body;
    try {
      const nuevoPeriodo = await periodoService.create({ nom_periodo });
      res.status(201).json(nuevoPeriodo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { idperiodo } = req.params;
    const { nom_periodo } = req.body;
    try {
      const periodoActualizado = await periodoService.update(
        parseInt(idperiodo),
        { nom_periodo }
      );
      if (!periodoActualizado) {
        return res.status(404).json({ message: "Periodo no encontrado" });
      }
      res.status(200).json(periodoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { idperiodo } = req.params;
    try {
      const deleted = await periodoService.delete(parseInt(idperiodo));
      if (!deleted) {
        return res.status(404).json({ message: "Periodo no encontrado" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = periodoController;
