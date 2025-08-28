const express = require("express");
const rubroController = require("../controllers/rubroController");
const router = express.Router();

// Rutas para el modelo Rubro
router.get("/", rubroController.getAll);
router.get("/:nrubro", rubroController.getByNro);
router.post("/", rubroController.create);
router.put("/:nrubro", rubroController.update);
router.delete("/:nrubro", rubroController.delete);

module.exports = router;
