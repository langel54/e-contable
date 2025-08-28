const tipoOperacionService = require("../services/tipoOperacionService");

const tipoOperacionController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { tiposOperacion, total } = await tipoOperacionService.getAll(
        skip,
        Number(limit)
      );

      res.json({
        tiposOperacion,
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
    const { idtipo_op } = req.params;
    try {
      const tipoOperacion = await tipoOperacionService.getById(
        Number(idtipo_op)
      );
      if (!tipoOperacion) {
        return res
          .status(404)
          .json({ message: "Tipo de Operación no encontrado" });
      }
      res.json(tipoOperacion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    try {
      const nuevoTipoOperacion = await tipoOperacionService.create(req.body);
      res.status(201).json(nuevoTipoOperacion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { idtipo_op } = req.params;
    try {
      const tipoOperacionActualizado = await tipoOperacionService.update(
        Number(idtipo_op),
        req.body
      );
      if (!tipoOperacionActualizado) {
        return res
          .status(404)
          .json({ message: "Tipo de Operación no encontrado" });
      }
      res.json(tipoOperacionActualizado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { idtipo_op } = req.params;
    try {
      const deleted = await tipoOperacionService.delete(Number(idtipo_op));
      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Tipo de Operación no encontrado" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = tipoOperacionController;
