const express = require("express");
const pdfEstadoCuentaController = require("../controllers/pdfEstadoCuentaController");
const router = express.Router();

// Ruta para generar PDF del estado de cuenta
router.get("/", pdfEstadoCuentaController.generate);

module.exports = router;

