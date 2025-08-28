const authService = require("../services/authService");

const authController = {
  async login(req, res) {
    console.log("🚀 ~ login ~ req:", req.body);
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async register(req, res) {
    try {
      const userData = req.body;
      const result = await authService.register(userData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = authController;
