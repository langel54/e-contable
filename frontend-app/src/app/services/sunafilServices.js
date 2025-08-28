import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export async function accessSunafil(data) {
  try {
    const token = Cookies.get("token");

    const response = await fetch(`${API_URL}/sunafil`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error en el servicio de SUNAT:", error);
    throw error;
  }
}
