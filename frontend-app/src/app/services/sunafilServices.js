import { fetchWithAuth } from "@/app/services/apiClient";
import { openSunatOrSunafilInNewTab } from "@/app/services/sunatOpenInTab";

// El modo (plugin | curl) se configura en el .env del backend: SUNAFIL_ACCESS_MODE
export async function accessSunafil(data) {
  try {
    const res = await fetchWithAuth("/sunafil", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.url) {
      openSunatOrSunafilInNewTab(res.url, "sunafil");
    }
    return res;
  } catch (error) {
    console.error('Error in accessSunafil:', error);
    throw error;
  }
}

const sunafilServices = {
  accessSunafil,
  getMonitoredClients: async () => {
    try {
      return await fetchWithAuth("/sunafil/monitored");
    } catch (error) {
      console.error('Error fetching monitored Sunafil clients:', error);
      throw error;
    }
  },

  toggleMonitoring: async (idclienteprov, status) => {
    try {
      return await fetchWithAuth("/sunafil/toggle", {
        method: "POST",
        body: JSON.stringify({ idclienteprov, status }),
      });
    } catch (error) {
      console.error('Error toggling Sunafil monitoring:', error);
      throw error;
    }
  },

  verifyAll: async () => {
    try {
      return await fetchWithAuth("/sunafil/verify-all", {
        method: "POST",
      });
    } catch (error) {
      console.error('Error verifying all Sunafil buzones:', error);
      throw error;
    }
  },

  markAsRead: async (mensajeId) => {
    try {
      return await fetchWithAuth("/sunafil/mark-read", {
        method: "POST",
        body: JSON.stringify({ mensajeId }),
      });
    } catch (error) {
      console.error('Error marking Sunafil alert as read:', error);
      throw error;
    }
  },

  markAllAsRead: async (idclienteprov) => {
    try {
      return await fetchWithAuth("/sunafil/mark-all-read", {
        method: "POST",
        body: JSON.stringify({ idclienteprov }),
      });
    } catch (error) {
      console.error('Error marking all Sunafil alerts as read:', error);
      throw error;
    }
  }
};

export default sunafilServices;
