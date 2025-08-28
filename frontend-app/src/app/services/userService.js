import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUsers = async (currentPage, currentPageSize, search = "") => {
  const token = Cookies.get("token");

  let url = `${API_URL}/users?page=${currentPage}&limit=${currentPageSize}`;
  if (search && search.length >= 2) {
    url += `&search=${search}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al cargar usuarios");

  const data = await response.json();

  return data;
};

export const fetchPersonal = async () => {
  const response = await fetch("/personal");
  if (!response.ok) throw new Error("Error al cargar personal");
  return await response.json();
};

export const getUsersTypes = async () => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/tipousuario`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al cargar tipos de usuario");

  return await response.json();
};

export const createUser = async (formData) => {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error("Error al agregar usuario y personal");
  }

  return data;
};

export const updateUser = async (id, formData) => {
  try {
    const token = Cookies.get("token");

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // if (!response.ok) throw new Error("Error al actualizar usuario");
    return data;
  } catch (error) {
    throw error; // Puedes lanzar el error para que sea manejado más arriba, si es necesario
  }
};

export const deleteUser = async (id) => {
  const response = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar usuario");
};
