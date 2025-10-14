
import { fetchWithAuth } from "@/app/services/apiClient";

export async function getNotas(page = 1, pageSize = 10, search = "") {
  let url = `/notas?page=${page}&limit=${pageSize}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
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
