import { fetchWithAuth } from "@/app/services/apiClient";

export const getFormaPagoTrib = async () => {
  return fetchWithAuth("/formapagotrib");
};

export const getPagosByTributo = async (idtributos) => {
  return fetchWithAuth(`/pagos/tributo/${idtributos}`);
};

export const addPago = async (idtributos, data) => {
  // Convertir importe_p a número si es string
  const importe_p = data.importe_p !== undefined ? Number(data.importe_p) : undefined;
  return fetchWithAuth(`/pagos`, {
    method: "POST",
    body: JSON.stringify({ ...data, idtributos, importe_p }),
  });
};

export const deletePago = async (idpagos) => {
  return fetchWithAuth(`/pagos/${idpagos}`, {
    method: "DELETE",
  });
};
