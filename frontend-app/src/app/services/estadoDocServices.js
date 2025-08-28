// services/estadoService.js

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Helper function to handle API calls
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = Cookies.get("token");
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error en la petición");
  }

  return response.json();
};

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
