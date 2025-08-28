const tmpService = require("../services/tempPagoService");

const tmpController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { tmps, total } = await tmpService.getAll(skip, limit);

      res.json({
        tmps,
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

  async getBySession(req, res) {
    try {
      const sessionId = req.params.sessionId;
      const tmps = await tmpService.getBySession(sessionId);
      res.json(tmps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      if (!req.body.session_id) {
        return res.status(400).json({ message: "Session ID es requerido" });
      }

      if (!req.body.fecha_p || !req.body.importe_p) {
        return res
          .status(400)
          .json({ message: "Fecha e importe son requeridos" });
      }

      const tmp = await tmpService.create(req.body);
      res.status(201).json(tmp);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const tmp = await tmpService.update(parseInt(req.params.id), req.body);
      if (!tmp) {
        return res
          .status(404)
          .json({ message: "Registro temporal no encontrado" });
      }
      res.json(tmp);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await tmpService.delete(parseInt(req.params.id));
      if (!result) {
        return res
          .status(404)
          .json({ message: "Registro temporal no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteBySession(req, res) {
    try {
      const sessionId = req.params.sessionId;
      await tmpService.deleteBySession(sessionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = tmpController;
