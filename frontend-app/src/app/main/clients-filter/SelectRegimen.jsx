import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { getRegimenes } from "@/app/services/regimenServices";

const SelectRegimen = ({ selected, setSelected }) => {
  const [regimenes, setRegimenes] = useState([]);

  const fetchRegimenes = async () => {
    try {
      const data = await getRegimenes();
      setRegimenes(data.regimenes);
    } catch (error) {
      console.error("Error fetching regimenes:", error);
    }
  };

  useEffect(() => {
    fetchRegimenes();
  }, []);
  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="estado-cliente-label">Régimen</InputLabel>
      <Select sx={{ width: 135 }} value={selected} onChange={handleChange}>
        <MenuItem key="reg_def" value="">
          Todos
        </MenuItem>
        {regimenes.map((regimen) => (
          <MenuItem key={regimen.idregimen} value={regimen.nregimen}>
            {regimen.nregimen}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectRegimen;
