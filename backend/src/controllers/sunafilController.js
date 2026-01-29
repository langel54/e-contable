const sunafilService = require("../services/sunafilService");
const { buildAutologinUrl } = require("../utils/sunatAuthHelper");

const sunafilController = {
  async login(req, res) {
    const { ruc, usuario, password } = req.body;
    if (!ruc || !usuario || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }
    try {
      // Ya no usamos Playwright para el login manual, generamos URL con hash para la extensión
      const url = buildAutologinUrl(
        process.env.SUNAFIL_LOGIN_URL,
        ruc,
        usuario,
        password,
        "SUNAFIL"
      );

      res.json({
        message: "URL de acceso generada correctamente",
        url
      });
    } catch (error) {
      console.error("❌ Error generando URL Sunafil:", error);
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
