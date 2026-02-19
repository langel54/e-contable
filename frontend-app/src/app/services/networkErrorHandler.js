/**
 * Manejador global para errores de conexión (servidor no disponible).
 * NotificationProvider registra aquí su callback para mostrar una alerta discreta.
 */

let onNetworkError = null;

export function setOnNetworkError(callback) {
  onNetworkError = callback;
}

export function notifyNetworkError() {
  if (typeof onNetworkError === "function") {
    onNetworkError("Sin conexión con el servidor.");
  }
}

/** Para detectar este tipo de error en catch */
export const NETWORK_ERROR_MESSAGE = "No se pudo conectar con el servidor.";
