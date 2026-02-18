import { FormControlLabel, styled, Switch } from "@mui/material";
import React from "react";

const SwitchIosComponent = ({ label = "iOS style", ...props }) => {
  // Definimos el switch estilizado fuera del componente para evitar re-renders
  const IOSSwitch = styled(Switch)(({ theme }) => ({
    width: 36,
    height: 20,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: theme.palette.common.white,
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.success.main,
          opacity: 1,
          border: 0,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: theme.palette.success.main,
        border: `6px solid ${theme.palette.common.white}`,
      },
      "&.Mui-disabled": {
        "& .MuiSwitch-thumb": {
          color:
            theme.palette.mode === "dark"
              ? theme.palette.grey[600]
              : theme.palette.grey[100],
        },
        "& + .MuiSwitch-track": {
          opacity: theme.palette.mode === "dark" ? 0.3 : 0.7,
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 16,
      height: 16,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300],
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  return (
    <FormControlLabel
      control={<IOSSwitch sx={{ m: 1 }} {...props} />}
      label={label}
    />
  );
};

export default SwitchIosComponent;
