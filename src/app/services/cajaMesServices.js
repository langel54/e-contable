// services/cajaMesService.js

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
