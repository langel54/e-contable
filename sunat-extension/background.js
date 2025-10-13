chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.url.includes("autologin=")) {
    console.log("🔑 Detectado autologin, limpiando cookies de SUNAT...");

    // Define los dominios donde la SUNAT guarda cookies
    const domains = [
      "api-seguridad.sunat.gob.pe",
      "e-menu.sunat.gob.pe",
      "sunat.gob.pe"
    ];

    for (const domain of domains) {
      chrome.cookies.getAll({ domain }, (cookies) => {
        cookies.forEach((cookie) => {
          const url = `https://${domain}${cookie.path}`;
          chrome.cookies.remove({
            url,
            name: cookie.name,
            storeId: cookie.storeId
          }, (removed) => {
            if (removed) {
              console.log(`🧹 Cookie eliminada: ${cookie.name} en ${domain}`);
            }
          });
        });
      });
    }

    // Ahora inyecta tu content_script si hace falta o deja que siga
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ["content_script.js"]
    });
  }
});
