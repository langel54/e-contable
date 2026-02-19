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

export const getDashboardTributosKPIs = async ({ anio, mes } = {}) => {
  const params = new URLSearchParams();
  if (anio) params.append("anio", anio);
  if (mes) params.append("mes", mes);
  return fetchWithAuth(`/dashboard/tributos/kpis?${params.toString()}`);
};

export const getDashboardTributosGraficos = async ({ anio, mes } = {}) => {
  const params = new URLSearchParams();
  if (anio) params.append("anio", anio);
  if (mes) params.append("mes", mes);
  return fetchWithAuth(`/dashboard/tributos/graficos?${params.toString()}`);
};

export const getDashboardTributosTablas = async () => {
  return fetchWithAuth("/dashboard/tributos/tablas");
};

export const getDashboardCajaKPIs = async ({ modo, anio, idperiodo }) => {
  return fetchWithAuth(
    "/dashboard/caja/kpis?modo=" + modo + "&anio=" + anio + "&mes=" + idperiodo
  );
};

export const getDashboardCajaGraficos = async ({ modo, anio, idperiodo }) => {
  return fetchWithAuth(
    "/dashboard/caja/graficos?modo=" +
    modo +
    "&anio=" +
    anio +
    "&mes=" +
    idperiodo
  );
};

export const getDashboardCajaTablas = async () => {
  return fetchWithAuth("/dashboard/caja/tablas");
};
