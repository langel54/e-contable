import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const SelectMes = ({ selected, setSelected }) => {
  const meses = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="mes-tributo-label">Mes</InputLabel>
      <Select sx={{ width: 110 }} value={selected} onChange={handleChange}>
        <MenuItem key="mes_def" value="">
          Todos
        </MenuItem>
        {meses.map((mes) => (
          <MenuItem key={mes.value} value={mes.value}>
            {mes.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectMes;
