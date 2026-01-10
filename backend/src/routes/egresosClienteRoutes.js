const express = require("express");
const egresosClienteController = require("../controllers/egresosClienteController");
const egresosAnnualReportController = require("../controllers/egresosAnnualReportController");
const router = express.Router();

// Ruta para obtener egresos por cliente y año
router.get("/", egresosClienteController.getByClientAndYear);
router.get("/annual-report", egresosAnnualReportController.getAnnualReport);

module.exports = router;

