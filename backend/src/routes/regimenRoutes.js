const express = require("express");
const regimenController = require("../controllers/regimenController");
const router = express.Router();

// Rutas para el modelo Regimen
router.get("/", regimenController.getAll);
router.get("/:nregimen", regimenController.getById);
router.post("/", regimenController.create);
router.put("/:nregimen", regimenController.update);
router.delete("/:nregimen", regimenController.delete);

module.exports = router;
