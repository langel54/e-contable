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

// Get all Rubros
export const getRubros = async () => {
  return fetchWithAuth("/rubro");
};

// Create a new Rubro
export const createRubro = async (data) => {
  return fetchWithAuth("/rubro", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing Rubro
export const updateRubro = async (id, data) => {
  return fetchWithAuth(`/rubro/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a Rubro
export const deleteRubro = async (id) => {
  return fetchWithAuth(`/rubro/${id}`, {
    method: "DELETE",
  });
};
