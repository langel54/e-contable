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

// Obtener todos los ingresos con paginación
export const getIngresos = async (
  page = 1,
  limit = 10,
  search,
  status,
  startDate,
  endDate,
  concept,
  period,
  year
) => {
  return fetchWithAuth(
    `/ingreso?page=${page}&limit=${limit}&search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}&concept=${concept}&period=${period}&year=${year}`
  );
};

// Obtener un ingreso por ID
export const getIngresoById = async (idingreso) => {
  return fetchWithAuth(`/ingreso/${idingreso}`);
};

// Crear un nuevo ingreso
export const createIngreso = async (data) => {
  return fetchWithAuth("/ingreso", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar un ingreso existente
export const updateIngreso = async (idingreso, data) => {
  return fetchWithAuth(`/ingreso/${idingreso}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar un ingreso
export const deleteIngreso = async (idingreso) => {
  return fetchWithAuth(`/ingreso/${idingreso}`, {
    method: "PATCH",
  });
};
