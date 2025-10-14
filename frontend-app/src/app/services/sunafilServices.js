import { fetchWithAuth } from "@/app/services/apiClient";

export async function accessSunafil(data) {
  return fetchWithAuth("/sunafil", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
