import { create } from "zustand";
import { fetchUsers, updateUser } from "@/app/services/userService";

export const useUserStore = create((set, get) => ({
  users: [],
  total: 0,
  loading: false,

  fetchUsers: async (page, pageSize, search) => {
    set({ loading: true }); // solo activa loading sin borrar data
    try {
      const data = await fetchUsers(page, pageSize, search);
      set({
        users: data.users,
        total: data.pagination.total,
        loading: false,
      });
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      set({ loading: false });
    }
  },

  updateUserInStore: async (id, newUserData) => {
    try {
      const res = await updateUser(id, newUserData);
      if (res.status == "201") {
        set((state) => ({
          users: state.users.map((u) =>
            u.id_usuario === id ? { ...u, ...newUserData } : u
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
}));
