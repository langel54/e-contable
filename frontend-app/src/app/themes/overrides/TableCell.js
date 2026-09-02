// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme) {
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          padding: "14px 16px",
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          "&.cell-right": {
            textAlign: "right",
            "& .MuiOutlinedInput-input": {
              textAlign: "right",
            },
          },
          "&.cell-center": {
            textAlign: "center",
          },
        },
        sizeSmall: {
          padding: "10px 12px",
          fontSize: "0.8125rem",
        },
        head: {
          fontSize: "0.8125rem",
          fontWeight: 600,
          textTransform: "none",
          color: theme.palette.text.secondary,
        },
        footer: {
          fontSize: "0.8125rem",
          fontWeight: 500,
          textTransform: "none",
          color: theme.palette.text.secondary,
        },
      },
    },
  };
}
