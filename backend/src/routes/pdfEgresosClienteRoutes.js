const express = require("express");
const pdfEgresosClienteController = require("../controllers/pdfEgresosClienteController");
const router = express.Router();

// Ruta para generar PDF de egresos por cliente
router.get("/", pdfEgresosClienteController.generate);

module.exports = router;

