import React, { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { getEstadoClientes } from "@/app/services/estadoClienteServices";
import { useAuth } from "@/app/provider";

const EstadoClienteSelect = () => {
  const { estadoClientesProvider, setEstadoClientesProvider } = useAuth();

  const [estadoClientes, setEstadoClientes] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState("");

  useEffect(() => {
    const fetchEstadoClientes = async () => {
      try {
        const data = await getEstadoClientes();
        setEstadoClientes(data.estadoClientes);
        // Seleccionar el primer estado por defecto
        if (data.estadoClientes.length > 0) {
          setSelectedEstado(data.estadoClientes[0].idestadocliente);
          setEstadoClientesProvider(
            estadoClientesProvider || data.estadoClientes[0].idestadocliente
          );
        }
      } catch (error) {
        console.error("Error fetching estadoClientes:", error);
      }
    };
    fetchEstadoClientes();
  }, []);

  const handleChange = (event) => {
    setSelectedEstado(event.target.value);
    setEstadoClientesProvider(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="estado-cliente-label">Estado de los clientes</InputLabel>
      <Select
        sx={{ width: 180 }}
        // size="small"
        value={estadoClientesProvider || selectedEstado}
        onChange={handleChange}
      >
        {estadoClientes.map((estado) => (
          <MenuItem key={estado.idestadocliente} value={estado.idestadocliente}>
            {estado.descripcion}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EstadoClienteSelect;
