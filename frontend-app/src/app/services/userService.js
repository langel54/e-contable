import { fetchWithAuth } from "./apiClient";
export const fetchUsers = async (currentPage, currentPageSize, search = "") => {
  let url = `/users?page=${currentPage}&limit=${currentPageSize}`;
  if (search && search.length >= 2) {
    url += `&search=${search}`;
  }
  return fetchWithAuth(url);
};

export const fetchPersonal = async () => {
  return fetchWithAuth("/personal");
};

export const getUsersTypes = async () => {
  return fetchWithAuth("/tipousuario");
};

export const createUser = async (formData) => {
  return fetchWithAuth("/users", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

export const updateUser = async (id, formData) => {
  return fetchWithAuth(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(formData),
  });
};

export const deleteUser = async (id) => {
  return fetchWithAuth(`/usuarios/${id}`, { method: "DELETE" });
};
