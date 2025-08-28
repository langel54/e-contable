const rubroService = require("../services/rubroService");

const rubroController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { rubros, total } = await rubroService.getAll(skip, Number(limit));

      res.json({
        rubros,
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

  // Obtener un registro por su número de rubro
  async getByNro(req, res) {
    const { nrubro } = req.params;
    try {
      const rubro = await rubroService.getByNro(nrubro);
      if (!rubro) {
        return res.status(404).json({ message: "Rubro no encontrado" });
      }
      res.json(rubro);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    try {
      const nuevoRubro = await rubroService.create(req.body);
      res.status(201).json(nuevoRubro);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { nrubro } = req.params;
    try {
      const rubroActualizado = await rubroService.update(nrubro, req.body);
      if (!rubroActualizado) {
        return res.status(404).json({ message: "Rubro no encontrado" });
      }
      res.json(rubroActualizado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { nrubro } = req.params;
    try {
      const deleted = await rubroService.delete(nrubro);
      if (!deleted) {
        return res.status(404).json({ message: "Rubro no encontrado" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = rubroController;
