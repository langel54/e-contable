const sunafilService = require("../services/sunafilService");
const { buildAutologinUrl } = require("../utils/sunatAuthHelper");
const scraperWorkerClient = require("../services/scraperWorkerClient");

// plugin = URL con #autologin para extensión; curl = login en servidor (Playwright) y retorno de URL final
const DEFAULT_ACCESS_MODE = process.env.SUNAFIL_ACCESS_MODE || "curl";

const sunafilController = {
  async login(req, res) {
    const { ruc, usuario, password, mode } = req.body;
    const accessMode = mode || req.query.mode || DEFAULT_ACCESS_MODE;

    if (!ruc || !usuario || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }
    try {
      if (accessMode === "curl") {
        const result = await sunafilService.accessSunafil({
          ruc,
          usuario,
          password,
        });
        if (!result.success) {
          return res.status(502).json({
            error: "No se pudo completar el login en el servidor.",
            detail: result.error,
          });
        }
        return res.json({
          message: "URL logueada generada correctamente",
          url: result.url,
          mode: "curl",
        });
      }

      const url = buildAutologinUrl(
        process.env.SUNAFIL_LOGIN_URL,
        ruc,
        usuario,
        password,
        "SUNAFIL"
      );

      res.json({
        message: "URL de acceso generada correctamente",
        url,
        mode: "plugin",
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
      const data = await scraperWorkerClient.startSunafilVerify();
      res.status(202).json({
        message:
          data.message ||
          "Verificación Sunafil encolada; el worker la ejecutará con Playwright.",
        jobId: data.jobId,
      });
    } catch (error) {
      console.error("Error llamando al worker Sunafil:", error);
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
      console.error("Error obteniendo progreso Sunafil:", error);
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
