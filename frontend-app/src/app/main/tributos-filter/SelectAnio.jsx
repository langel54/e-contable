import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const SelectAnio = ({ selected, setSelected }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="anio-tributo-label">Año</InputLabel>
      <Select sx={{ width: 100}} value={selected} onChange={handleChange}>
        <MenuItem key="anio_def" value="">
          Todos
        </MenuItem>
        {years.map((year) => (
          <MenuItem key={year} value={year.toString()}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectAnio;
