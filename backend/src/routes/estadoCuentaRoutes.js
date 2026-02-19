const express = require("express");
const estadoCuentaController = require("../controllers/estadoCuentaController");
const router = express.Router();

// Ruta para obtener estado de cuenta por cliente y año
router.get("/", estadoCuentaController.getByClientAndYear);

module.exports = router;

