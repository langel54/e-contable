import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { getClientesForFilter } from "@/app/services/tributosService";

const SelectCliente = ({ selected, setSelected }) => {
  const [clientes, setClientes] = useState([]);

  const fetchClientes = async () => {
    try {
      const data = await getClientesForFilter();
      setClientes(data.clientesProvs || data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="cliente-tributo-label">Cliente</InputLabel>
      <Select sx={{ width: 200 }} value={selected} onChange={handleChange}>
        <MenuItem key="cli_def" value="">
          Todos
        </MenuItem>
        {clientes.map((cliente) => (
          <MenuItem key={cliente.idclienteprov} value={cliente.idclienteprov}>
            {cliente.razonsocial} - {cliente.ruc || cliente.dni}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectCliente;
