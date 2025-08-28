const express = require("express");
const tipoDocumentoController = require("../controllers/tipoDocumentoController");
const router = express.Router();

router.get("/", tipoDocumentoController.getAll);
router.get("/:id", tipoDocumentoController.getById);
router.post("/", tipoDocumentoController.create);
router.put("/:id", tipoDocumentoController.update);
router.delete("/:id", tipoDocumentoController.delete);

module.exports = router;
