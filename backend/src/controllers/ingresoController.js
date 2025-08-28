const ingresoService = require("../services/ingresoService");

const ingresoController = {
  // Obtener todos los registros con paginación
  async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        startDate,
        endDate,
        concept,
        period,
        year,
        status,
      } = req.query;

      const skip = (page - 1) * limit;

      const { ingresos, total } = await ingresoService.getAll(
        skip,
        Number(limit),
        startDate,
        endDate,
        Number(concept),
        Number(period),
        Number(year),
        Number(status)
      );

      res.json({
        ingresos,
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
    const { idingreso } = req.params;
    try {
      const ingreso = await ingresoService.getById(Number(idingreso));
      if (!ingreso) {
        return res.status(404).json({ message: "Ingreso no encontrado" });
      }
      res.json(ingreso);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear un nuevo registro
  async create(req, res) {
    try {
      const nuevoIngreso = await ingresoService.create(req.body);
      res.status(201).json(nuevoIngreso);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar un registro existente
  async update(req, res) {
    const { idingreso } = req.params;
    console.log("🚀 Apii:", idingreso);
    try {
      const ingresoActualizado = await ingresoService.update(
        Number(idingreso),
        req.body
      );
      if (!ingresoActualizado) {
        return res.status(404).json({ message: "Ingreso no encontrado" });
      }
      res.json(ingresoActualizado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar un registro
  async delete(req, res) {
    const { idingreso } = req.params;
    try {
      const deleted = await ingresoService.delete(Number(idingreso));
      if (!deleted) {
        return res.status(404).json({ message: "Ingreso no encontrado" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = ingresoController;
