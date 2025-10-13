(function () {
  if (window.__sunat_autologin_auto_ran) return;
  window.__sunat_autologin_auto_ran = true;

  console.log("AUTLOGIN: Iniciando...");

  // --- Decodificar payload desde el hash ---
  const hash = window.location.hash || "";
  const match = hash.match(/autologin=([^&]+)/);
  if (!match) return;

  let payload;
  try {
    const json = decodeURIComponent(atob(match[1]));
    payload = JSON.parse(json);
  } catch (err) {
    console.warn("AUTLOGIN: payload inválido", err);
    return;
  }

  // Validar expiración
  const now = Date.now();
  const maxAge =
    (payload.maxAgeMs && Number(payload.maxAgeMs)) || 2 * 60 * 1000;
  if (!payload.ts || now - payload.ts > maxAge) {
    console.warn("AUTLOGIN: token expirado");
    return;
  }

  const ruc = payload.u || "";
  const usuario = payload.usuario || payload.user || "";
  const password = payload.p || payload.pass || payload.password || "";
  if (!ruc || !usuario || !password) {
    console.warn("AUTLOGIN: faltan credenciales");
    return;
  }

  console.log("AUTLOGIN: origen =>", payload.origin || "DESCONOCIDO");

  // --- Helper: esperar selector ---
  function waitForSelector(selector, timeout = 10000) {
    return new Promise((resolve) => {
      const t0 = Date.now();
      const check = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - t0 > timeout) return resolve(null);
        setTimeout(check, 300);
      };
      check();
    });
  }

  // --- Proceso principal ---
  (async () => {
    console.log("AUTLOGIN: Esperando campos de login...");

    const txtRuc = await waitForSelector("#txtRuc", 8000);
    const txtUsuario = await waitForSelector("#txtUsuario", 8000);
    const txtContrasena = await waitForSelector("#txtContrasena", 8000);

    if (!txtRuc || !txtUsuario || !txtContrasena) {
      console.warn("AUTLOGIN: No se encontraron campos de login.");
      return;
    }

    txtRuc.value = ruc;
    txtRuc.dispatchEvent(new Event("input", { bubbles: true }));

    txtUsuario.value = usuario;
    txtUsuario.dispatchEvent(new Event("input", { bubbles: true }));

    txtContrasena.value = password;
    txtContrasena.dispatchEvent(new Event("input", { bubbles: true }));

    console.log("AUTLOGIN: Campos rellenados.");

    // Opcionales
    const j_username = document.getElementById("j_username");
    const j_password = document.getElementById("j_password");
    const custom_ruc = document.getElementById("custom_ruc");
    const tipo = document.getElementById("tipo");
    if (j_username) j_username.value = usuario;
    if (j_password) j_password.value = password;
    if (custom_ruc) custom_ruc.value = ruc;
    if (tipo) tipo.value = "2";

    const btnAceptar = await waitForSelector("#btnAceptar", 5000);
    if (btnAceptar) {
      console.log("AUTLOGIN: Simulando click en 'Entrar'...");
      setTimeout(() => btnAceptar.click(), 800);
    } else {
      console.warn("AUTLOGIN: No se encontró botón Entrar.");
    }

    // Limpiar hash
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch (e) {}
  })();
})();
