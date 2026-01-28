const sunafilService = require("../services/sunafilService");

const sunafilController = {
  async login(req, res) {
    const { ruc, usuario, password } = req.body;
    if (!ruc || !usuario || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }
    try {
      const result = await sunafilService.accessSunafil({ ruc, usuario, password });
      if (result.success) {
        res.json({ message: "Login exitoso", items: result.items, url: result.url });
      } else {
        res.status(500).json({ error: "Error en login", detail: result.error });
      }
    } catch (error) {
      console.error("❌ Error general:", error);
      res.status(500).json({ error: "Error en el servidor." });
    }
  },

  async getMonitoredClients(req, res) {
    try {
      const data = await sunafilService.getMonitoringData();
      res.json(data);
    } catch (error) {
      console.error("Error obteniendo datos de monitoreo Sunafil:", error);
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
        result = await sunafilService.addClientToMonitoring(idclienteprov);
      } else {
        result = await sunafilService.removeClientFromMonitoring(idclienteprov);
      }
      res.json({ message: "Estado de monitoreo Sunafil actualizado", result });
    } catch (error) {
      console.error("Error actualizando monitoreo Sunafil:", error);
      res.status(500).json({ error: "Error en el servidor." });
    }
  },

  async verifyAll(req, res) {
    try {
      sunafilService
        .verifyMonitoredSunafil()
        .then((results) => {
          console.log("Verificación masiva Sunafil completada:", results);
        })
        .catch((err) => {
          console.error("Error en verificación masiva Sunafil:", err);
        });

      res.status(202).json({ message: "Verificación Sunafil iniciada en segundo plano." });
    } catch (error) {
      console.error("Error iniciando verificación Sunafil:", error);
      res.status(500).json({ error: "Error en el servidor." });
    }
  },

  async markAsRead(req, res) {
    const { mensajeId } = req.body;
    if (!mensajeId) {
      return res.status(400).json({ error: "Falta mensajeId." });
    }
    try {
      const result = await sunafilService.markMessageAsRead(mensajeId);
      res.json(result);
    } catch (error) {
      console.error("Error marcando alerta Sunafil como leída:", error);
      res.status(500).json({ error: error.message || "Error en el servidor." });
    }
  },

  async markAllAsRead(req, res) {
    const { idclienteprov } = req.body;
    if (!idclienteprov) {
      return res.status(400).json({ error: "Falta idclienteprov." });
    }
    try {
      const result = await sunafilService.markAllMessagesAsRead(idclienteprov);
      res.json(result);
    } catch (error) {
      console.error("Error marcando todas las alertas Sunafil como leídas:", error);
      res.status(500).json({ error: error.message || "Error en el servidor." });
    }
  },
};

module.exports = sunafilController;
