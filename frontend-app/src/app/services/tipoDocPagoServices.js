// services/tipoDocumentoService.js

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

// Obtener todos los tipos de documento con paginación
export const getTiposDocumento = async (page = 1, limit = 10, search) => {
  return fetchWithAuth(
    `/tipodocumento?page=${page}&limit=${limit}&search=${search}`
  );
};

// Obtener un tipo de documento por ID
export const getTipoDocumentoById = async (idtipo_doc) => {
  return fetchWithAuth(`/tipodocumento/${idtipo_doc}`);
};

// Crear un nuevo tipo de documento
export const createTipoDocumento = async (data) => {
  return fetchWithAuth("/tipodocumento", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar un tipo de documento existente
export const updateTipoDocumento = async (idtipo_doc, data) => {
  return fetchWithAuth(`/tipodocumento/${idtipo_doc}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar un tipo de documento
export const deleteTipoDocumento = async (idtipo_doc) => {
  return fetchWithAuth(`/tipodocumento/${idtipo_doc}`, {
    method: "DELETE",
  });
};
