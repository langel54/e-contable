const express = require("express");
const {
  openMisDeclaracionesApp,
} = require("../controllers/misDeclaracionesController");
const router = express.Router();

router.post("/", openMisDeclaracionesApp);

module.exports = router;
