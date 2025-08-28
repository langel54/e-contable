import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { digitos } from "../clients/configs";

const SelectDigito = ({ selected, setSelected }) => {
  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="digito-cliente-label">Dígito (Todos)</InputLabel>
      <Select
        sx={{ width: 135 }}
        value={selected}
        onChange={handleChange}
        // displayEmpty
        labelId="digito-cliente-label"
      >
        <MenuItem key="dig_def" value="">
          Todos
        </MenuItem>
        {digitos.map((digito) => (
          <MenuItem key={digito} value={digito}>
            {digito}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectDigito;
