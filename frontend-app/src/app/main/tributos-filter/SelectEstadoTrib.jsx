import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const SelectEstadoTrib = ({ selected, setSelected }) => {
  const estados = [
    { value: "0", label: "Pendiente" },
    { value: "1", label: "Cancelado" },
    // { value: "A", label: "Anulado" },
  ];

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="estado-tributo-label">Estado</InputLabel>
      <Select sx={{ width: 110 }} value={selected} onChange={handleChange}>
        <MenuItem key="est_def" value="">
          Todos
        </MenuItem>
        {estados.map((estado) => (
          <MenuItem key={estado.value} value={estado.value}>
            {estado.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectEstadoTrib;
