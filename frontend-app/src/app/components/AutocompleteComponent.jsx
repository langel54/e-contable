import React, { useState, useCallback } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

const InfiniteSelect = ({
  // Función para cargar datos
  fetchData,
  // Función para obtener el label de cada opción
  getOptionLabel = (option) => option.label || "",
  // Función para obtener el valor único de cada opción
  getOptionValue = (option) => option.id,
  // Función para renderizar cada opción
  renderOption,
  // Función para transformar la respuesta de la API
  transformResponse = (response) => ({
    items: response.items || [],
    total: response.total || 0,
  }),
  // Props de configuración
  label = "Seleccionar",
  placeholder = "Buscar...",
  pageSize = 10,
  initialValue = null,
  onChange,
  // Props adicionales
  noOptionsText = "No hay resultados",
  loadingText = "Cargando...",
  ...autocompleteProps
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadOptions = useCallback(
    async (searchTerm, currentPage) => {
      setLoading(true);
      try {
        const response = await fetchData({
          page: currentPage,
          pageSize,
          search: searchTerm,
        });

        const { items, total } = transformResponse(response);

        if (currentPage === 1) {
          setOptions(items);
        } else {
          setOptions((prevOptions) => [...prevOptions, ...items]);
        }

        setHasMore(currentPage * pageSize < total);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchData, pageSize, transformResponse]
  );

  // Cargar datos iniciales
  React.useEffect(() => {
    loadOptions("", 1);
  }, [loadOptions]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    setPage(1);
    loadOptions(newInputValue, 1);
  };

  const handleScroll = (event) => {
    const listbox = event.target;
    const scrollBottom =
      Math.abs(
        listbox.scrollHeight - listbox.scrollTop - listbox.clientHeight
      ) < 1;

    if (!loading && hasMore && scrollBottom) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOptions(inputValue, nextPage);
    }
  };

  return (
    <Autocomplete
      sx={{ width: "100%" }}
      options={options}
      value={initialValue}
      getOptionLabel={getOptionLabel}
      filterOptions={(x) => x}
      onInputChange={handleInputChange}
      onChange={(event, newValue) => onChange?.(newValue)}
      isOptionEqualToValue={(option, value) =>
        getOptionValue(option) === getOptionValue(value)
      }
      ListboxProps={{
        onScroll: handleScroll,
        style: { maxHeight: "200px" },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={renderOption}
      noOptionsText={noOptionsText}
      loadingText={loadingText}
      {...autocompleteProps}
    />
  );
};

export default InfiniteSelect;

/*********
  * lo que se nececita......
  * 
  * 
  const [selectedClient, setSelectedClient] = useState(null);

  const transformResponse = (response) => ({
    items: response.clientesProvs || [],
    total: response.pagination?.total || 0,
  });

  const fetchClients = async ({ page, pageSize, search }) => {
    return getClientesProvs(page, pageSize, search, 1);
  };


  *************

  <InfiniteSelect
        fetchData={fetchClients}
        transformResponse={transformResponse}
        getOptionLabel={(option) => option.razonsocial}
        getOptionValue={(option) => option.idclienteprov}
        label="Buscar Cliente"
        value={selectedClient}
        onChange={setSelectedClient}
        renderOption={(props, option) => (
          <li {...props} key={option.idclienteprov}>
            <div style={{ padding: "8px 0" }}>
              <div style={{ fontWeight: 500 }}>{option.razonsocial}</div>
              <div style={{ fontSize: "0.8em", color: "rgba(0, 0, 0, 0.6)" }}>
                RUC: {option.ruc}
              </div>
            </div>
          </li>
        )}
      />
*/
