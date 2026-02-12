"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { setOnNetworkError } from "@/app/services/networkErrorHandler";

const NotificationContext = createContext({
  showNotification: () => {},
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
});

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info", // 'success' | 'error' | 'warning' | 'info'
  });

  const showNotification = useCallback((message, severity = "info") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const showSuccess = useCallback(
    (message) => showNotification(message, "success"),
    [showNotification]
  );

  const showError = useCallback(
    (message) => showNotification(message, "error"),
    [showNotification]
  );

  const showWarning = useCallback(
    (message) => showNotification(message, "warning"),
    [showNotification]
  );

  const showInfo = useCallback(
    (message) => showNotification(message, "info"),
    [showNotification]
  );

  useEffect(() => {
    setOnNetworkError(showError);
    return () => setOnNetworkError(null);
  }, [showError]);

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
