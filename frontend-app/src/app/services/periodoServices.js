// services/periodoService.js

import { fetchWithAuth } from "./apiClient";

// Obtener todos los periodos con paginación
export const getPeriodos = async (page = 1, limit = 10, search) => {
  return fetchWithAuth(`/periodo?page=${page}&limit=${limit}&search=${search}`);
};

// Obtener un periodo por ID
export const getPeriodoById = async (idperiodo) => {
  return fetchWithAuth(`/periodo/${idperiodo}`);
};

// Crear un nuevo periodo
export const createPeriodo = async (data) => {
  return fetchWithAuth("/periodo", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar un periodo existente
export const updatePeriodo = async (idperiodo, data) => {
  return fetchWithAuth(`/periodo/${idperiodo}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar un periodo
export const deletePeriodo = async (idperiodo) => {
  return fetchWithAuth(`/periodo/${idperiodo}`, {
    method: "DELETE",
  });
};
