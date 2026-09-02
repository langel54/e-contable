const estadoCuentaService = require("../services/estadoCuentaService");

const estadoCuentaController = {
  // Obtener estado de cuenta por cliente y año
  async getByClientAndYear(req, res) {
    try {
      const { idclienteprov, year, tipo } = req.query;

      const tipoValido =
        tipo === "INGRESO" || tipo === "SALIDA" ? tipo : undefined;
      if (tipo && !tipoValido) {
        return res.status(400).json({
          message: "El parámetro 'tipo' debe ser INGRESO o SALIDA.",
        });
      }

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

      const result = await estadoCuentaService.getByClientAndYear(
        idclienteprov,
        Number(year),
        tipoValido
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = estadoCuentaController;

