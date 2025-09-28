import React, { useState } from "react";
import InfiniteSelect from "@/app/components/AutocompleteComponent";
import { getClientesProvs } from "@/app/services/clienteProvService";

const SelectCliente = ({ selected, setSelected }) => {
  const [selectedClient, setSelectedClient] = useState(null);

  const transformResponse = (response) => ({
    items: response.clientesProvs || [],
    total: response.pagination?.total || 0,
  });

  const fetchClients = async ({ page, pageSize, search }) => {
    return getClientesProvs(page, pageSize, search, 1);
  };

  const handleClientChange = (newValue) => {
    setSelectedClient(newValue);
    setSelected(newValue?.idclienteprov || "");
  };

  return (
    <InfiniteSelect
      fetchData={fetchClients}
      transformResponse={transformResponse}
      getOptionLabel={(option) => option.razonsocial}
      getOptionValue={(option) => option.idclienteprov}
      label="Buscar Cliente"
      placeholder="Seleccionar cliente..."
      value={selectedClient}
      onChange={handleClientChange}
      renderOption={(props, option) => (
        <li {...props} key={option.idclienteprov}>
          <div style={{ padding: "8px 0" }}>
            <div style={{ fontWeight: 500 }}>{option.razonsocial}</div>
            <div
              style={{
                fontSize: "0.8em",
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              RUC: {option.ruc || option.dni}
            </div>
          </div>
        </li>
      )}
      sx={{ minWidth: 350 }}
    />
  );
};

export default SelectCliente;
