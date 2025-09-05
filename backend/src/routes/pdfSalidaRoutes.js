const express = require("express");
const pdfController = require("../controllers/pdfSalidaController");
const router = express.Router();

// GET /generate-pdf/:idsalida
router.get("/:idsalida", pdfController.generate);

module.exports = router;
