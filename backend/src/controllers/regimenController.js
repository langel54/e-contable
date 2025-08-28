const regimenService = require("../services/regimenService");

const regimenController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    const { skip, limit } = req.query;
    try {
      const { regimenes, total } = await regimenService.getAll(
        parseInt(skip) || 0,
        parseInt(limit) || 10
      );
      res.status(200).json({ regimenes, total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un registro por su ID
  async getById(req, res) {
    const { nregimen } = req.params;
    try {
      const regimen = await regimenService.getById(nregimen);
      if (!regimen) {
        return res.status(404).json({ message: "Regimen no encontrado" });
      }
      res.status(200).json(regimen);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    const { nregimen, idregimen } = req.body;
    try {
      const nuevoRegimen = await regimenService.create({ nregimen, idregimen });
      res.status(201).json(nuevoRegimen);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { nregimen } = req.params;
    const { idregimen } = req.body;
    try {
      const regimenActualizado = await regimenService.update(nregimen, {
        idregimen,
      });
      if (!regimenActualizado) {
        return res.status(404).json({ message: "Regimen no encontrado" });
      }
      res.status(200).json(regimenActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { nregimen } = req.params;
    try {
      const deleted = await regimenService.delete(nregimen);
      if (!deleted) {
        return res.status(404).json({ message: "Regimen no encontrado" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = regimenController;
