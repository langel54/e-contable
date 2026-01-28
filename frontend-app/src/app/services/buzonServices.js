import { fetchWithAuth } from "@/app/services/apiClient";

const buzonServices = {
    getMonitoredClients: async () => {
        try {
            return await fetchWithAuth("/buzon/monitored");
        } catch (error) {
            console.error('Error fetching monitored clients:', error);
            throw error;
        }
    },

    toggleMonitoring: async (idclienteprov, status) => {
        try {
            return await fetchWithAuth("/buzon/toggle", {
                method: "POST",
                body: JSON.stringify({ idclienteprov, status }),
            });
        } catch (error) {
            console.error('Error toggling monitoring:', error);
            throw error;
        }
    },

    verifyAll: async () => {
        try {
            return await fetchWithAuth("/buzon/verify-all", {
                method: "POST",
            });
        } catch (error) {
            console.error('Error verifying all buzones:', error);
            throw error;
        }
    },

    markAsRead: async (mensajeId) => {
        try {
            return await fetchWithAuth("/buzon/mark-read", {
                method: "POST",
                body: JSON.stringify({ mensajeId }),
            });
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    },

    markAllAsRead: async (idclienteprov) => {
        try {
            return await fetchWithAuth("/buzon/mark-all-read", {
                method: "POST",
                body: JSON.stringify({ idclienteprov }),
            });
        } catch (error) {
            console.error('Error marking all messages as read:', error);
            throw error;
        }
    }
};

export default buzonServices;
