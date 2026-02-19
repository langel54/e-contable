
import { fetchWithAuth } from "./apiClient";

const endpoint = "/tipotributo";

export const getTiposTributo = async (page = 1, limit = 10) => {
    return fetchWithAuth(`${endpoint}?page=${page}&limit=${limit}`);
};

export const getTipoTributoById = async (id) => {
    return fetchWithAuth(`${endpoint}/${id}`);
};

export const createTipoTributo = async (data) => {
    return fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateTipoTributo = async (id, data) => {
    return fetchWithAuth(`${endpoint}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

export const deleteTipoTributo = async (id) => {
    return fetchWithAuth(`${endpoint}/${id}`, {
        method: "DELETE",
    });
};
