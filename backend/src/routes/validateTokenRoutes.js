const express = require("express");
const validateTokenController = require("../controllers/validateTokeController");
const router = express.Router();

router.get("/", validateTokenController.validate);

module.exports = router;
