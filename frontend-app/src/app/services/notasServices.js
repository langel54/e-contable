
import { fetchWithAuth } from "@/app/services/apiClient";

export async function getNotas(page = 1, pageSize = 10, filters = {}) {
  let url = `/notas?page=${page}&limit=${pageSize}`;
  
  if (filters.search) {
    url += `&search=${encodeURIComponent(filters.search)}`;
  }
  if (filters.cliente) {
    url += `&cliente=${encodeURIComponent(filters.cliente)}`;
  }
  if (filters.fechaInicio) {
    url += `&fechaInicio=${encodeURIComponent(filters.fechaInicio)}`;
  }
  if (filters.fechaFin) {
    url += `&fechaFin=${encodeURIComponent(filters.fechaFin)}`;
  }
  
  return fetchWithAuth(url);
}

export async function createNota(payload) {
  return fetchWithAuth("/notas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateNota(id, payload) {
  return fetchWithAuth(`/notas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteNota(id) {
  return fetchWithAuth(`/notas/${id}`, {
    method: "DELETE" });
}
