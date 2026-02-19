// services/estadoService.js

import { fetchWithAuth } from "@/app/services/apiClient";

// Obtener todos los estados con paginación
export const getEstados = async (page = 1, limit = 10, search) => {
  return fetchWithAuth(`/estado?page=${page}&limit=${limit}&search=${search}`);
};

// Obtener un estado por ID
export const getEstadoById = async (idestado) => {
  return fetchWithAuth(`/estado/${idestado}`);
};

// Crear un nuevo estado
export const createEstado = async (data) => {
  return fetchWithAuth("/estado", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar un estado existente
export const updateEstado = async (idestado, data) => {
  return fetchWithAuth(`/estado/${idestado}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar un estado
export const deleteEstado = async (idestado) => {
  return fetchWithAuth(`/estado/${idestado}`, {
    method: "DELETE",
  });
};
