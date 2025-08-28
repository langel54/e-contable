const conceptoService = require("../services/conceptoService");

const conceptoController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { conceptos, total } = await conceptoService.getAll(
        skip,
        Number(limit)
      );

      res.json({
        conceptos,
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

  async getById(req, res) {
    try {
      const { id } = req.params;
      const concepto = await conceptoService.getById(Number(id));

      if (!concepto) {
        return res.status(404).json({ message: "Concepto no encontrado" });
      }

      res.json(concepto);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const { nombre_concepto } = req.body;

      const newConcepto = await conceptoService.create({ nombre_concepto });

      res.status(201).json(newConcepto);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre_concepto } = req.body;

      const updatedConcepto = await conceptoService.update(Number(id), {
        nombre_concepto,
      });

      if (!updatedConcepto) {
        return res.status(404).json({ message: "Concepto no encontrado" });
      }

      res.json(updatedConcepto);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deletedConcepto = await conceptoService.delete(Number(id));

      if (!deletedConcepto) {
        return res.status(404).json({ message: "Concepto no encontrado" });
      }

      res.json({ message: "Concepto eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = conceptoController;
