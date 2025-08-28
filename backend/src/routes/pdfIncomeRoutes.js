const express = require("express");
const pdfController = require("../controllers/pdfIncomeController");
const router = express.Router();

// GET /generate-pdf/:idingreso
router.get("/:idingreso", pdfController.generate);

module.exports = router;
