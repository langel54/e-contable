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

// Get vencimientos by year, month and u_digito
export const getVencimientos = async (anio, mes, u_digito) => {
  console.log("🚀 ~ getVencimientos ~ anio:", anio, mes, u_digito);
  return fetchWithAuth(
    `/vencimientos?anio=${anio}&mes=${mes}&u_digito=${u_digito}`
  );
};

// Get all vencimientos
export const getAllVencimientos = async () => {
  return fetchWithAuth("/vencimientos");
};

// Create vencimiento
export const createVencimiento = async (vencimientoData) => {
  return fetchWithAuth("/vencimientos", {
    method: "POST",
    body: JSON.stringify(vencimientoData),
  });
};

// Update vencimiento
export const updateVencimiento = async (id, vencimientoData) => {
  return fetchWithAuth(`/vencimientos/${id}`, {
    method: "PUT",
    body: JSON.stringify(vencimientoData),
  });
};

// Delete vencimiento
export const deleteVencimiento = async (id) => {
  return fetchWithAuth(`/vencimientos/${id}`, {
    method: "DELETE",
  });
};
