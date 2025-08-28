const express = require("express");
const router = express.Router();
const sunafilController = require("../controllers/sunafilController");

// POST /scraping/login
router.post("/", sunafilController.login);

module.exports = router;
