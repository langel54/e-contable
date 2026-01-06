const express = require("express");
const egresosClienteController = require("../controllers/egresosClienteController");
const router = express.Router();

// Ruta para obtener egresos por cliente y año
router.get("/", egresosClienteController.getByClientAndYear);

module.exports = router;

