import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import { getClientesProvs, getClienteProvById } from "@/app/services/clienteProvService";

const NotasClienteAutocomplete = ({ value, onChange, sx }) => {
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (value && typeof value === 'string' && (!selectedClient || selectedClient.idclienteprov !== value)) {
      // Si solo tenemos el ID (string), buscamos el objeto completo del cliente.
      getClienteProvById(value).then(cliente => {
        setSelectedClient(cliente);
      });
    } else if (!value) {
      setSelectedClient(null);
    }
  }, [value, selectedClient]);

  const transformResponse = (response) => ({
    items: response.clientesProvs || [],
    total: response.pagination?.total || 0,
  });

  const fetchClients = async ({ page, pageSize, search }) => {
    return getClientesProvs(page, pageSize, search, 1);
  };

  const handleClientChange = (newValue) => {
    setSelectedClient(newValue);
    onChange(newValue?.idclienteprov || "");
  };

  return (
    <InfiniteSelect
      fetchData={fetchClients}
      transformResponse={transformResponse}
      getOptionLabel={(option) => option.razonsocial}
      getOptionValue={(option) => option.idclienteprov}
      label="Busqueda por RUC / Cliente"
      placeholder="Buscar cliente..."
      value={selectedClient}
      onChange={handleClientChange}
      renderOption={(props, option) => (
        <li {...props} key={option.idclienteprov}>
          <div style={{ padding: "8px 0" }}>
            <div style={{ fontWeight: 500 }}>{option.razonsocial}</div>
            <Box component="span" sx={{ fontSize: "0.8em", color: "text.secondary" }}>
              RUC: {option.ruc || option.dni}
            </Box>
          </div>
        </li>
      )}
      sx={sx || { minWidth: 280 }}
    />
  );
};

export default NotasClienteAutocomplete;
