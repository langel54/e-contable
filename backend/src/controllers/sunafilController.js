const { accessSunafil } = require("../services/sunafilService");

const sunafilController = {
  async login(req, res) {
    
    const { ruc, usuario, password } = req.body;

    if (!ruc || !usuario || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    try {
      const result = await accessSunafil({ ruc, usuario, password });

      if (result.success) {
        res.json({ message: "Login exitoso", url: result.url, result:result.menuItems });
      } else {
        res.status(500).json({ error: "Error en login", detail: result.error });
      }
    } catch (error) {
      console.error("❌ Error general:", error);
      res.status(500).json({ error: "Error en el servidor." });
    }
  },
};

module.exports = sunafilController;
