// services/cajaAnualService.js

import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener todas las cajas anuales con paginación
export const getCajasAnuales = async (page = 1, limit = 10, search = "") => {
  return fetchWithAuth(
    `/caja-anual?page=${page}&limit=${limit}&search=${search}`
  );
};

// Obtener una caja anual por código
export const getCajaAnualByCod = async (codcaja_a) => {
  return fetchWithAuth(`/caja-anual/${codcaja_a}`);
};

// Crear una nueva caja anual
export const createCajaAnual = async (data) => {
  return fetchWithAuth("/caja-anual", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar una caja anual existente
export const updateCajaAnual = async (codcaja_a, data) => {
  return fetchWithAuth(`/caja-anual/${codcaja_a}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar una caja anual
export const deleteCajaAnual = async (codcaja_a) => {
  return fetchWithAuth(`/caja-anual/${codcaja_a}`, {
    method: "DELETE",
  });
};
