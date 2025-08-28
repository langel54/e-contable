const express = require("express");
const tmpController = require("../controllers/tempPagoController");
const router = express.Router();

router.get("/", tmpController.getAll);
router.get("/session/:sessionId", tmpController.getBySession);
router.post("/", tmpController.create);
router.put("/:id", tmpController.update);
router.delete("/:id", tmpController.delete);
router.delete("/session/:sessionId", tmpController.deleteBySession);

module.exports = router;
