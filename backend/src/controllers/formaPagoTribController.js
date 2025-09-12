const formaPagoTribService = require("../services/formaPagoTribService");

const formaPagoTribController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    const { skip, limit } = req.query;
    try {
      const { formaPagoTribs, total } = await formaPagoTribService.getAll(
        parseInt(skip) || 0,
        parseInt(limit) || 10
      );
      res.status(200).json({ formaPagoTribs, total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un registro por su ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const formaPagoTrib = await formaPagoTribService.getById(id);
      if (!formaPagoTrib) {
        return res.status(404).json({ message: "FormaPagoTrib no encontrado" });
      }
      res.status(200).json(formaPagoTrib);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    const { descripcion } = req.body;
    try {
      const nuevaFormaPagoTrib = await formaPagoTribService.create({
        descripcion,
      });
      res.status(201).json(nuevaFormaPagoTrib);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { idforma_pago_trib } = req.params;
    const { descripcion } = req.body;
    try {
      const formaPagoTribActualizado = await formaPagoTribService.update(
        idforma_pago_trib,
        { descripcion }
      );
      if (!formaPagoTribActualizado) {
        return res.status(404).json({ message: "FormaPagoTrib no encontrado" });
      }
      res.status(200).json(formaPagoTribActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { idforma_pago_trib } = req.params;
    try {
      const deleted = await formaPagoTribService.delete(idforma_pago_trib);
      if (!deleted) {
        return res.status(404).json({ message: "FormaPagoTrib no encontrado" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = formaPagoTribController;
