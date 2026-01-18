// services/cajaAnualService.js

import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener todas las cajas anuales con paginación
export const getCajasAnuales = async (page = 1, limit = 10, search = "") => {
  return fetchWithAuth(
    `/cajaanual?page=${page}&limit=${limit}&search=${search}`
  );
};

// Obtener una caja anual por código
export const getCajaAnualByCod = async (codcaja_a) => {
  return fetchWithAuth(`/cajaanual/${codcaja_a}`);
};

// Crear una nueva caja anual
export const createCajaAnual = async (data) => {
  return fetchWithAuth("/cajaanual", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar una caja anual existente
export const updateCajaAnual = async (codcaja_a, data) => {
  return fetchWithAuth(`/cajaanual/${codcaja_a}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar una caja anual
export const deleteCajaAnual = async (codcaja_a) => {
  return fetchWithAuth(`/cajaanual/${codcaja_a}`, {
    method: "DELETE",
  });
};

// Cerrar caja anual
export const closeCajaAnual = async (codcaja_a) => {
  return fetchWithAuth(`/cajaanual/close/${codcaja_a}`, {
    method: "PUT"
  });
};

// Obtener saldo anterior
export const getLastAnualBalance = async (year) => {
  return fetchWithAuth(`/cajaanual/getLastBalance?year=${year}`);
};
