import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Obtener todas las cajas anuales con paginación

export const pdfIncomeService = async (idingreso) => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/pdf-income/${idingreso}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error en la petición");
  }

  return response.blob(); // 👈 importante
};
