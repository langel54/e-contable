import { create } from "zustand";
import {
  updateClienteProv,
  createClienteProv,
  deleteClienteProv,
  getClientesProvs,
} from "@/app/services/clienteProvService";

export const clientsStore = create((set, get) => ({
  clients: [],
  total: 0,
  loading: false,

  // Cargar clientes desde el backend
  fetchClientesProvs: async (page, pageSize, search, estado) => {
    set({ loading: true });
    try {
      const data = await getClientesProvs(page, pageSize, search, estado);
      set({
        clients: data.clientesProvs,
        total: data.pagination.total,
        loading: false,
      });
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      set({ loading: false });
    }
  },

  // Agregar cliente al store y backend
  addClient: async (newClientData) => {
    try {
      const res = await createClienteProv(newClientData);
      if (res) {
        const newClient = res.data;
        set((state) => ({
          clients: [newClient, ...state.clients],
          total: state.total + 1,
        }));
        return { success: true, client: newClient };
      } else {
        return { success: false };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Actualizar cliente
  updateClient: async (id, updatedData) => {
    try {
      const res = await updateClienteProv(id, updatedData);
      if (res) {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.idclienteprov === id ? { ...c, ...updatedData } : c
          ),
        }));
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Eliminar cliente (opcional)
  deleteClient: async (id) => {
    try {
      const res = await deleteClienteProv(id);
      if (res.status === 200) {
        set((state) => ({
          clients: state.clients.filter((c) => c.idclienteprov !== id),
          total: state.total - 1,
        }));
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
}));
