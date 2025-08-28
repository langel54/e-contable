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

// Get all Regimenes
export const getRegimenes = async () => {
  return fetchWithAuth("/regimen");
};

// Create a new Regimen
export const createRegimen = async (data) => {
  return fetchWithAuth("/regimen", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing Regimen
export const updateRegimen = async (id, data) => {
  return fetchWithAuth(`/regimen/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a Regimen
export const deleteRegimen = async (id) => {
  return fetchWithAuth(`/regimen/${id}`, {
    method: "DELETE",
  });
};
