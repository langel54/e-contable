import React, { useState, useEffect } from "react";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import { getClientesProvs } from "@/app/services/clienteProvService";

const NotasClienteAutocomplete = ({ value, onChange, sx }) => {
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (!value) {
      setSelectedClient(null);
      return;
    }
    // Fetch client by id if needed (optional, for controlled mode)
    // You can implement this if you want to fetch the client by id
  }, [value]);

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
            <div style={{ fontSize: "0.8em", color: "rgba(0, 0, 0, 0.6)" }}>
              RUC: {option.ruc || option.dni}
            </div>
          </div>
        </li>
      )}
      sx={sx || { minWidth: 280 }}
    />
  );
};

export default NotasClienteAutocomplete;
