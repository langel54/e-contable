const egresosClienteService = require("../services/egresosClienteService");

const egresosClienteController = {
  // Obtener egresos por cliente y año
  async getByClientAndYear(req, res) {
    try {
      const { idclienteprov, year } = req.query;

      if (!idclienteprov) {
        return res
          .status(400)
          .json({ message: "El parámetro 'idclienteprov' es requerido." });
      }

      if (!year) {
        return res
          .status(400)
          .json({ message: "El parámetro 'year' es requerido." });
      }

      const result = await egresosClienteService.getByClientAndYear(
        idclienteprov,
        Number(year)
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = egresosClienteController;

