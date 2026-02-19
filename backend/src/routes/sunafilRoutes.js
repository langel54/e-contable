const express = require("express");
const router = express.Router();
const sunafilController = require("../controllers/sunafilController");

// Servir dashboard
router.get("/monitored", sunafilController.getMonitoredClients);
router.get("/verify-progress", sunafilController.getVerifyProgress);
router.post("/toggle", sunafilController.toggleMonitoring);
router.post("/verify-all", sunafilController.verifyAll);
router.post("/mark-read", sunafilController.markAsRead);
router.post("/mark-all-read", sunafilController.markAllAsRead);

// Legacy/Individual login
router.post("/", sunafilController.login);

module.exports = router;
