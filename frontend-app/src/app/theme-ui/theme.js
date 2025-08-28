import { createTheme } from "@mui/material/styles";

const commonSettings = {
  typography: {
    fontFamily: "'Roboto', sans-serif",
    button: {
      textTransform: "none", // Evita que los textos de los botones estén en mayúsculas
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "1rem",
          fontWeight: 600,
        },
        contained: {
          boxShadow: "none", // Elimina la sombra en botones con `variant="contained"`
        },
        outlined: {
          borderWidth: "2px", // Grosor de bordes en botones con `variant="outlined"`
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Sombra personalizada
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: "2.5rem",
          fontWeight: 700,
        },
        h2: {
          fontSize: "2rem",
          fontWeight: 600,
        },
        body1: {
          fontSize: "1rem",
          color: "#555",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: "0px 0px 12px 12px", // Bordes redondeados en la parte inferior
          padding: "10px 20px",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: "0px 12px 12px 0px", // Bordes redondeados en un drawer
          padding: "20px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontSize: "0.875rem",
          fontWeight: 500,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0 8px", // Espaciado entre filas
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
          borderBottom: "none",
          borderRadius: "8px",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: "#f4f4f4",
          borderRadius: "12px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 500,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 8, // Espaciado entre el switch y el slider
        },
        switchBase: {
          "&.Mui-checked": {
            color: "#fff", // Color del círculo en el estado `checked`
          },
        },
        track: {
          borderRadius: 16,
          backgroundColor: "#ccc",
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#f4f4f4",
      paper: "#fff",
    },
    text: {
      primary: "#000",
      secondary: "#555",
    },
  },
  ...commonSettings,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#fff",
      secondary: "#aaa",
    },
  },
  ...commonSettings,
});
