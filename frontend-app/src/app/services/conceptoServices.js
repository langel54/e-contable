// services/conceptoService.js

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

// Obtener todos los conceptos con paginación
export const getConceptos = async (page = 1, limit = 10, search) => {
  return fetchWithAuth(
    `/concepto?page=${page}&limit=${limit}&search=${search}`
  );
};

// Obtener un concepto por ID
export const getConceptoById = async (idconcepto) => {
  return fetchWithAuth(`/concepto/${idconcepto}`);
};

// Crear un nuevo concepto
export const createConcepto = async (data) => {
  return fetchWithAuth("/concepto", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar un concepto existente
export const updateConcepto = async (idconcepto, data) => {
  return fetchWithAuth(`/concepto/${idconcepto}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar un concepto
export const deleteConcepto = async (idconcepto) => {
  return fetchWithAuth(`/concepto/${idconcepto}`, {
    method: "DELETE",
  });
};
