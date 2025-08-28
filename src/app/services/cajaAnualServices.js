// services/cajaAnualService.js

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

// Obtener todas las cajas anuales con paginación
export const getCajasAnuales = async (page = 1, limit = 10, search) => {
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
