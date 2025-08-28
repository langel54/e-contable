const express = require("express");
const clienteProvController = require("../controllers/clienteProvController");
const router = express.Router();

router.get("/validate-ruc/:ruc", clienteProvController.validateRucController); // Eliminar un registro
router.get("/filter", clienteProvController.getAllFilter); // Eliminar un registro
router.put(
  "/update-declarado",
  clienteProvController.updateDeclaradoController
);
router.get("/", clienteProvController.getAll);
router.get("/:id", clienteProvController.getById);
router.post("/", clienteProvController.create);
router.put("/:id", clienteProvController.update);
router.delete("/:id", clienteProvController.delete);

module.exports = router;
