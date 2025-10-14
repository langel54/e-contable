// services/tipoOperacionService.js

import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener todos los tipos de operación con paginación
export const getTiposOperacion = async (page = 1, limit = 10, search = "") => {
  return fetchWithAuth(
    `/tipo-operacion?page=${page}&limit=${limit}&search=${search}`
  );
};

// Obtener un tipo de operación por ID
export const getTipoOperacionById = async (idtipo_op) => {
  return fetchWithAuth(`/tipo-operacion/${idtipo_op}`);
};

// Crear un nuevo tipo de operación
export const createTipoOperacion = async (data) => {
  return fetchWithAuth("/tipo-operacion", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar un tipo de operación existente
export const updateTipoOperacion = async (idtipo_op, data) => {
  return fetchWithAuth(`/tipo-operacion/${idtipo_op}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar un tipo de operación
export const deleteTipoOperacion = async (idtipo_op) => {
  return fetchWithAuth(`/tipo-operacion/${idtipo_op}`, {
    method: "DELETE",
  });
};
