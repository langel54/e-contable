import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { getTiposTributo } from "@/app/services/tributosService";

const SelectTipoTrib = ({ selected, setSelected }) => {
  const [tiposTributo, setTiposTributo] = useState([]);

  const fetchTiposTributo = async () => {
    try {
      const data = await getTiposTributo();
      setTiposTributo(data.tipoTribs || data);
    } catch (error) {
      console.error("Error fetching tipos tributo:", error);
    }
  };

  useEffect(() => {
    fetchTiposTributo();
  }, []);

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="tipo-tributo-label">Tipo Tributo</InputLabel>
      <Select sx={{ width: 140 }} value={selected} onChange={handleChange}>
        <MenuItem key="tipo_def" value="">
          Todos
        </MenuItem>
        {tiposTributo.map((tipo) => (
          <MenuItem key={tipo.idtipo_trib} value={tipo.idtipo_trib}>
            {tipo.descripcion_t}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectTipoTrib;
