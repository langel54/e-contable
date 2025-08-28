require("dotenv").config(); // Para manejar variables de entorno
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

const validateTokenController = {
  async validate(req, res) {
    {
      const token = req.headers.authorization?.split(" ")[1]; // Extraer token del encabezado

      if (!token) {
        return res
          .status(401)
          .json({ valid: false, message: "Token no proporcionado" });
      }

      try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verificar token
        return res.status(200).json({
          valid: true,
          user: decoded, // Información decodificada del token
        });
      } catch (error) {
        return res
          .status(401)
          .json({ valid: false, message: "Token inválido" });
      }
    }
  },
};

module.exports = validateTokenController;
