/**
 * Abre la URL de SUNAT/SUNAFIL en una nueva pestaña (no ventana).
 * Sin width/height para que el navegador abra pestaña, no popup.
 *
 * @param {string} url - URL ya logueada a abrir (SUNAT o SUNAFIL)
 * @param {'sunat'|'sunafil'} [origin='sunat'] - Se mantiene por compatibilidad
 */
export function openSunatOrSunafilInNewTab(url, origin = "sunat") {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}
