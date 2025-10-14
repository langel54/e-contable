// services/cajaMesService.js

import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener todas las cajas de mes con paginación
export const getCajasMes = async (page = 1, limit = 10, search = "") => {
  return fetchWithAuth(
    `/caja-mes?page=${page}&limit=${limit}&search=${search}`
  );
};

// Obtener una caja de mes por código
export const getCajaMesByCod = async (codcaja_m) => {
  return fetchWithAuth(`/caja-mes/${codcaja_m}`);
};

// Crear una nueva caja de mes
export const createCajaMes = async (data) => {
  return fetchWithAuth("/caja-mes", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar una caja de mes existente
export const updateCajaMes = async (codcaja_m, data) => {
  return fetchWithAuth(`/caja-mes/${codcaja_m}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar una caja de mes
export const deleteCajaMes = async (codcaja_m) => {
  return fetchWithAuth(`/caja-mes/${codcaja_m}`, {
    method: "DELETE",
  });
};
