import { fetchWithAuth } from "@/app/services/apiClient";

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
    method: "DELETE",
  });
};

// Reporte Anual
export const getAnnualReport = async (year) => {
  return fetchWithAuth(`/ingreso/report/annual?year=${year}`);
};
