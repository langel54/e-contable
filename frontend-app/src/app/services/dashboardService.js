import { fetchWithAuth } from "./apiClient";

// Dashboard service
export const getDashboardClientesKPIs = async () => {
  return fetchWithAuth("/dashboard/clientes/kpis");
};

export const getDashboardClientesGraficos = async () => {
  return fetchWithAuth("/dashboard/clientes/graficos");
};

export const getDashboardClientesTablas = async () => {
  return fetchWithAuth("/dashboard/clientes/tablas");
};

export const getDashboardTributosKPIs = async () => {
  return fetchWithAuth("/dashboard/tributos/kpis");
};

export const getDashboardTributosGraficos = async () => {
  return fetchWithAuth("/dashboard/tributos/graficos");
};

export const getDashboardTributosTablas = async () => {
  return fetchWithAuth("/dashboard/tributos/tablas");
};

export const getDashboardCajaKPIs = async () => {
  return fetchWithAuth("/dashboard/caja/kpis");
};

export const getDashboardCajaGraficos = async () => {
  return fetchWithAuth("/dashboard/caja/graficos");
};

export const getDashboardCajaTablas = async () => {
  return fetchWithAuth("/dashboard/caja/tablas");
};
