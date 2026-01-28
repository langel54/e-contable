const buzonService = require("../services/buzonService");

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
            buzonService.verifyMonitoredBuzones().then(results => {
                console.log("Verificación masiva completada:", results);
            }).catch(err => {
                console.error("Error en verificación masiva:", err);
            });

            res.status(202).json({ message: "Verificación iniciada en segundo plano." });
        } catch (error) {
            console.error("Error iniciando verificación:", error);
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
