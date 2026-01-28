const express = require("express");
const buzonController = require("../controllers/buzonController");
const router = express.Router();

router.get("/monitored", buzonController.getMonitoredClients);
router.post("/toggle", buzonController.toggleMonitoring);
router.post("/verify-all", buzonController.verifyAll);
router.post("/mark-read", buzonController.markAsRead);
router.post("/mark-all-read", buzonController.markAllAsRead);

module.exports = router;
