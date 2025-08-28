const tipoDocumentoService = require("../services/tipoDocumentoService");

const tipoDocumentoController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { tipoDocumentos, total } = await tipoDocumentoService.getAll(
        skip,
        limit
      );

      res.json({
        tipoDocumentos,
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
      const tipoDocumento = await tipoDocumentoService.getById(
        parseInt(req.params.id)
      );
      if (!tipoDocumento) {
        return res
          .status(404)
          .json({ message: "Tipo de documento no encontrado" });
      }
      res.json(tipoDocumento);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const tipoDocumento = await tipoDocumentoService.create(req.body);
      res.status(201).json(tipoDocumento);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const tipoDocumento = await tipoDocumentoService.update(
        parseInt(req.params.id),
        req.body
      );
      if (!tipoDocumento) {
        return res
          .status(404)
          .json({ message: "Tipo de documento no encontrado" });
      }
      res.json(tipoDocumento);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await tipoDocumentoService.delete(parseInt(req.params.id));
      if (!result) {
        return res
          .status(404)
          .json({ message: "Tipo de documento no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      if (error.code === "P2003") {
        return res.status(400).json({
          message:
            "No se puede eliminar el tipo de documento porque está siendo utilizado en ingresos o salidas",
        });
      }
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = tipoDocumentoController;
