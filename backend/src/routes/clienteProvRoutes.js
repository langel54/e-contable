const express = require("express");
const clienteProvController = require("../controllers/clienteProvController");
const router = express.Router();

router.get("/validate-ruc/:ruc", clienteProvController.validateRucController);
router.get("/filter", clienteProvController.getAllFilter);
router.get("/bulk/status", (req, res) => res.json({ ok: true, message: "Bulk disponible" }));
router.put(
  "/update-declarado",
  clienteProvController.updateDeclaradoController
);
router.get("/", clienteProvController.getAll);
router.get("/:id", clienteProvController.getById);
router.post("/bulk", clienteProvController.bulkCreate);
router.post("/bulk-large", clienteProvController.bulkCreateLarge);
router.post("/", clienteProvController.create);
router.put("/:id", clienteProvController.update);
router.delete("/:id", clienteProvController.delete);

module.exports = router;
