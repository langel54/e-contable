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

// Obtener todos los expenses con paginación y filtros
export const getExpenses = async (
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
    `/egreso?page=${page}&limit=${limit}&search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}&concept=${concept}&period=${period}&year=${year}`
  );
};

// Obtener un egreso por ID
export const getSalidaById = async (idsalida) => {
  return fetchWithAuth(`/egreso/${idsalida}`);
};

// Crear un nuevo egreso
export const createSalida = async (data) => {
  return fetchWithAuth("/egreso", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Actualizar un egreso existente
export const updateSalida = async (idsalida, data) => {
  return fetchWithAuth(`/egreso/${idsalida}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Eliminar un egreso
export const deleteSalida = async (idsalida) => {
  return fetchWithAuth(`/egreso/${idsalida}`, {
    method: "DELETE",
  });
};
