import Cookies from "js-cookie";
import { notifyNetworkError, NETWORK_ERROR_MESSAGE } from "./networkErrorHandler";
import { API_BASE } from "./apiConfig";

async function fetchPdf(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Error en la petición");
    }
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      notifyNetworkError();
      throw new Error(NETWORK_ERROR_MESSAGE);
    }
    throw error;
  }
}

// Servicio para PDF de salida
export const pdfSalidaService = async (idsalida) => {
  const token = Cookies.get("token");
  const response = await fetchPdf(`${API_BASE}/pdf-salida/${idsalida}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.blob();
};

export const pdfIncomeService = async (idingreso) => {
  const token = Cookies.get("token");
  const response = await fetchPdf(`${API_BASE}/pdf-income/${idingreso}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.blob();
};

export const pdfEstadoCuentaService = async (idclienteprov, year) => {
  const token = Cookies.get("token");
  const response = await fetchPdf(
    `${API_BASE}/pdf-estado-cuenta?idclienteprov=${idclienteprov}&year=${year}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.blob();
};

export const pdfEgresosClienteService = async (idclienteprov, year) => {
  const token = Cookies.get("token");
  const response = await fetchPdf(
    `${API_BASE}/pdf-egresos-cliente?idclienteprov=${idclienteprov}&year=${year}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.blob();
};