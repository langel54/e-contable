const facturadorService = require("../services/facturadorService");

const facturadorController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    const { skip, limit } = req.query;
    try {
      const { facturadores, total } = await facturadorService.getAll(
        parseInt(skip) || 0,
        parseInt(limit) || 10
      );
      res.status(200).json({ facturadores, total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un registro por su ID
  async getById(req, res) {
    const { idfacturador } = req.params;
    try {
      const facturador = await facturadorService.getById(
        parseInt(idfacturador)
      );
      if (!facturador) {
        return res.status(404).json({ message: "Facturador no encontrado" });
      }
      res.status(200).json(facturador);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    const { n_facturador, f_obs } = req.body;
    try {
      const nuevoFacturador = await facturadorService.create({
        n_facturador,
        f_obs,
      });
      res.status(201).json(nuevoFacturador);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { idfacturador } = req.params;
    const { n_facturador, f_obs } = req.body;
    try {
      const facturadorActualizado = await facturadorService.update(
        parseInt(idfacturador),
        { n_facturador, f_obs }
      );
      if (!facturadorActualizado) {
        return res.status(404).json({ message: "Facturador no encontrado" });
      }
      res.status(200).json(facturadorActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { idfacturador } = req.params;
    try {
      const deleted = await facturadorService.delete(parseInt(idfacturador));
      if (!deleted) {
        return res.status(404).json({ message: "Facturador no encontrado" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = facturadorController;
