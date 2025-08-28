import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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

// Get all Facturadores
export const getFacturadores = async () => {
  return fetchWithAuth("/facturador");
};

// Create a new Facturador
export const createFacturador = async (data) => {
  return fetchWithAuth("/facturador", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing Facturador
export const updateFacturador = async (id, data) => {
  return fetchWithAuth(`/facturador/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a Facturador
export const deleteFacturador = async (id) => {
  return fetchWithAuth(`/facturador/${id}`, {
    method: "DELETE",
  });
};
