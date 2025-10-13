const tributosService = require("../services/tributosService");

const tributosController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { tributos, total } = await tributosService.getAll(skip, limit);

      res.json({
        tributos,
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
      const tributo = await tributosService.getById(parseInt(req.params.id));
      res.json(tributo);
    } catch (error) {
      if (error.type === "not_found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  async getByCliente(req, res) {
    try {
      const tributos = await tributosService.getByCliente(
        req.params.idclienteprov
      );
      res.json(tributos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const tributo = await tributosService.create(req.body);
      res.status(201).json(tributo);
    } catch (error) {
      if (error.type === "validation") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const tributo = await tributosService.update(
        parseInt(req.params.id),
        req.body
      );
      res.json(tributo);
    } catch (error) {
      if (error.type === "not_found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.type === "validation") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const force = req.query.force === 'true';
      const result = await tributosService.delete(parseInt(req.params.id), force);
      res.status(200).json({ success: true, message: "Tributo eliminado correctamente" });
    } catch (error) {
      if (error.type === "not_found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.type === "forbidden") {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  async getFilter(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        idclienteprov = "",
        idtipo_trib = "",
        anio = "",
        mes = "",
        estado = "",
      } = req.query;
      const skip = (page - 1) * limit;

      const { tributos, total } = await tributosService.getFilter(
        skip,
        limit,
        idclienteprov,
        idtipo_trib,
        anio,
        mes,
        estado
      );

      res.json({
        tributos,
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
};

module.exports = tributosController;
