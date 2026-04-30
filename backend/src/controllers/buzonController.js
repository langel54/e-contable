const buzonService = require("../services/buzonService");
const scraperWorkerClient = require("../services/scraperWorkerClient");

const buzonController = {
    async getMonitoredClients(req, res) {
        try {
            const data = await buzonService.getMonitoringData();
            res.json(data);
        } catch (error) {
            console.error("Error obteniendo datos de monitoreo:", error);
            res.status(500).json({ error: "Error en el servidor." });
        }
    },

    async toggleMonitoring(req, res) {
        const { idclienteprov, status } = req.body;
        if (!idclienteprov || status === undefined) {
            return res.status(400).json({ error: "Faltan idclienteprov o status." });
        }
        try {
            let result;
            if (status) {
                result = await buzonService.addClientToMonitoring(idclienteprov);
            } else {
                result = await buzonService.removeClientFromMonitoring(idclienteprov);
            }
            res.json({ message: "Estado de monitoreo actualizado", result });
        } catch (error) {
            console.error("Error actualizando monitoreo:", error);
            res.status(500).json({ error: "Error en el servidor." });
        }
    },

    async verifyAll(req, res) {
        try {
            const data = await scraperWorkerClient.startBuzonVerify();
            res.status(202).json({
                message:
                    data.message ||
                    "Verificación encolada; el worker la ejecutará con Playwright.",
                jobId: data.jobId,
            });
        } catch (error) {
            console.error("Error llamando al worker buzón:", error);
            const msg = String(error.message || error);
            if (
                msg.includes("ECONNREFUSED") ||
                msg.includes("fetch failed") ||
                msg.includes("No autorizado")
            ) {
                return res.status(503).json({
                    error:
                        "Worker de scraping no disponible o token incorrecto. Inicie `npm run worker` o el servicio backend-worker y revise SCRAPER_WORKER_URL / SCRAPER_WORKER_SECRET.",
                    detail: msg,
                });
            }
            res.status(500).json({ error: "Error en el servidor." });
        }
    },

    async getVerifyProgress(req, res) {
        try {
            const jobId = req.query.jobId;
            if (!jobId) {
                return res.status(400).json({
                    error: "Falta jobId. Debe venir de la respuesta de POST /verify-all.",
                });
            }
            const progress = await scraperWorkerClient.getJobProgress(jobId);
            res.json(progress);
        } catch (error) {
            console.error("Error obteniendo progreso:", error);
            res.status(500).json({ error: "Error en el servidor." });
        }
    },

    async markAsRead(req, res) {
        const { mensajeId } = req.body;
        if (!mensajeId) {
            return res.status(400).json({ error: "Falta mensajeId." });
        }
        try {
            const result = await buzonService.markMessageAsRead(mensajeId);
            res.json(result);
        } catch (error) {
            console.error("Error marcando como leído:", error);
            res.status(500).json({ error: error.message || "Error en el servidor." });
        }
    },

    async markAllAsRead(req, res) {
        const { idclienteprov } = req.body;
        if (!idclienteprov) {
            return res.status(400).json({ error: "Falta idclienteprov." });
        }
        try {
            const result = await buzonService.markAllMessagesAsRead(idclienteprov);
            res.json(result);
        } catch (error) {
            console.error("Error marcando todo como leído:", error);
            res.status(500).json({ error: error.message || "Error en el servidor." });
        }
    }
};

module.exports = buzonController;
