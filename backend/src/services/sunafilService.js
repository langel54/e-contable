const { chromium } = require("playwright");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function accessSunafil({ ruc, usuario, password }) {
  const url =
    "https://api-seguridad.sunat.gob.pe/v1/clientessol/b6474e23-8a3b-4153-b301-dafcc9646250/oauth2/login?originalUrl=https://casillaelectronica.sunafil.gob.pe/si.inbox/Login/Empresa&state=s";

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    await page.waitForSelector("#txtRuc", { timeout: 10000 });
    await page.fill("#txtRuc", ruc);
    await page.fill("#txtUsuario", usuario);
    await page.fill("#txtContrasena", password);

    // Capturar logs del navegador
    page.on("console", (msg) => console.log("BROWSER LOG:", msg.text()));

    await Promise.all([
      page.click("#btnAceptar"),
      page.waitForLoadState("networkidle", { timeout: 30000 }),
    ]);
    const currentUrl = page.url();
    // console.log(`🔗 URL final tras login: ${currentUrl}`);

    // Esperar a que la tabla aparezca (si es que aparece) o un timeout corto
    try {
      await page.waitForSelector("#formNotificaciones\\:dtNotiAlertas", { timeout: 15000 });
      // console.log("✅ Tabla de notificaciones encontrada.");
    } catch (e) {
      // console.log("⚠️ La tabla de notificaciones no apareció. Verificando si hay otros elementos...");
      const bodyText = await page.innerText("body").catch(() => "");
      if (bodyText.includes("No tiene notificaciones")) {
        // console.log("ℹ️ El sistema indica que no hay notificaciones para este usuario.");
      }
    }

    // Extraer alertas de la tabla inicial
    const items = await page
      .$$eval("#formNotificaciones\\:dtNotiAlertas tbody tr", (rows) => {
        return rows.map((row) => {
          // Buscamos el label dentro del primer td para la descripción
          const descriptionLabel = row.querySelector("td:nth-child(1) label");
          const description = descriptionLabel ? descriptionLabel.textContent.trim() : "";

          // Buscamos el label dentro del segundo td para la cantidad
          const quantityLabel = row.querySelector("td:nth-child(2) label");
          const quantity = quantityLabel ? quantityLabel.textContent.trim() : "0";
          return { description, quantity };
        });
      })
      .catch(() => []);

    // console.log(`✅ Extracción completada para ${ruc}. Items encontrados:`, items.length);

    return { success: true, items, url: currentUrl };
  } catch (error) {
    // console.error("❌ Error en acceso Sunafil:", error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

async function verifyMonitoredSunafil() {
  // console.log("Iniciando verificación masiva de Sunafil...");
  const monitoringEntries = await prisma.monitoreo_sunafil.findMany();
  const clientIds = monitoringEntries.map((e) => e.idclienteprov);

  if (clientIds.length === 0) return [];

  const clients = await prisma.clienteProv.findMany({
    where: { idclienteprov: { in: clientIds } },
    select: {
      idclienteprov: true,
      ruc: true,
      c_usuario: true,
      c_passw: true,
      razonsocial: true,
    },
  });

  const results = [];

  for (const client of clients) {
    if (!client.ruc || !client.c_usuario || !client.c_passw) continue;

    try {
      const result = await accessSunafil({
        ruc: client.ruc,
        usuario: client.c_usuario,
        password: client.c_passw,
      });

      if (result.success && result.items) {
        // Limpiar alertas anteriores para este cliente
        await prisma.monitoreo_sunafil_alerta.deleteMany({
          where: { idclienteprov: client.idclienteprov },
        });

        for (const item of result.items) {
          await prisma.monitoreo_sunafil_alerta.create({
            data: {
              idclienteprov: client.idclienteprov,
              descripcion: item.description,
              cantidad: item.quantity,
            },
          });
        }

        // Sumar las cantidades individuales para el total de alertas pendientes
        const totalAlerts = result.items.reduce((acc, item) => {
          const q = parseInt(item.quantity) || 0;
          return acc + q;
        }, 0);

        await prisma.monitoreo_sunafil.update({
          where: { idclienteprov: client.idclienteprov },
          data: {
            cantidad_pendientes: totalAlerts,
            ultima_revision: new Date(),
          },
        });

        results.push({ idclienteprov: client.idclienteprov, success: true, count: totalAlerts });
      }
    } catch (error) {
      console.error(`Error procesando Sunafil para ${client.ruc}:`, error);
    }
  }
  return results;
}

async function getMonitoringData() {
  const monitoringEntries = await prisma.monitoreo_sunafil.findMany();
  const clientIds = monitoringEntries.map((e) => e.idclienteprov);

  if (clientIds.length === 0) return [];

  const clients = await prisma.clienteProv.findMany({
    where: { idclienteprov: { in: clientIds } },
    select: { idclienteprov: true, ruc: true, razonsocial: true },
  });

  const alerts = await prisma.monitoreo_sunafil_alerta.findMany({
    where: { idclienteprov: { in: clientIds }, leido: false },
  });

  return clients.map((client) => {
    const entry = monitoringEntries.find((e) => e.idclienteprov === client.idclienteprov);
    return {
      ...client,
      cantidad_no_leidos: entry?.cantidad_pendientes || 0,
      ultima_revision: entry?.ultima_revision,
      unreadMessages: alerts
        .filter((a) => a.idclienteprov === client.idclienteprov)
        .map((a) => ({
          mensajeId: a.alertaId,
          asunto: a.descripcion,
          fecha: a.fecha_captura,
          tag: a.cantidad,
        })),
    };
  });
}

async function addClientToMonitoring(idclienteprov) {
  return await prisma.monitoreo_sunafil.upsert({
    where: { idclienteprov },
    update: {},
    create: { idclienteprov },
  });
}

async function removeClientFromMonitoring(idclienteprov) {
  try {
    await prisma.monitoreo_sunafil_alerta.deleteMany({ where: { idclienteprov } });
    return await prisma.monitoreo_sunafil.delete({ where: { idclienteprov } });
  } catch (e) {
    return null;
  }
}

async function markMessageAsRead(alertaId) {
  const alert = await prisma.monitoreo_sunafil_alerta.findUnique({ where: { alertaId } });
  if (!alert) throw new Error("Alerta no encontrada");

  await prisma.monitoreo_sunafil_alerta.delete({ where: { alertaId } });

  const unreadCount = await prisma.monitoreo_sunafil_alerta.count({
    where: { idclienteprov: alert.idclienteprov, leido: false },
  });

  await prisma.monitoreo_sunafil.update({
    where: { idclienteprov: alert.idclienteprov },
    data: { cantidad_pendientes: unreadCount },
  });

  return { success: true, unreadCount };
}

async function markAllMessagesAsRead(idclienteprov) {
  await prisma.monitoreo_sunafil_alerta.deleteMany({ where: { idclienteprov } });
  await prisma.monitoreo_sunafil.update({
    where: { idclienteprov },
    data: { cantidad_pendientes: 0 },
  });
  return { success: true, unreadCount: 0 };
}

module.exports = {
  accessSunafil,
  verifyMonitoredSunafil,
  getMonitoringData,
  addClientToMonitoring,
  removeClientFromMonitoring,
  markMessageAsRead,
  markAllMessagesAsRead,
};
