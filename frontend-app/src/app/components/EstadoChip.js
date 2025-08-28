import { Chip, useTheme } from "@mui/material";

const EstadoChip = ({ estado, label }) => {
  const theme = useTheme(); // Obtener el tema actual de MUI

  const estados = {
    1: {
      label: "Emitido",
      bgColor: theme.palette.success.light,
      textColor: theme.palette.success.dark,
    },
    2: {
      label: "Anulado",
      bgColor: theme.palette.error.light,
      textColor: theme.palette.error.dark,
    },
    3: {
      label: "Pendiente",
      bgColor: theme.palette.warning.light,
      textColor: theme.palette.warning.dark,
    },
  };

  return (
    <Chip
      label={label || "Desconocido"}
      sx={{
        height: 14,
        fontSize: 8,
        fontWeight: 600,
        pl: 0,
        color: estados[estado]?.textColor || theme.palette.text.primary,
        backgroundColor: estados[estado]?.bgColor || theme.palette.grey[300],
        borderRadius: 16,
        margin: 0,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
};

export default EstadoChip;
