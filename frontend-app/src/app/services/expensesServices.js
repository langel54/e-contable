import { fetchWithAuth } from "@/app/services/apiClient";

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
