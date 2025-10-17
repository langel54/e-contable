import React from "react";
import {
  Box,
  Stack,
  FormControl,
  InputAdornment,
  IconButton,
  TextField,
  Tooltip,
  Button,
  Chip,
} from "@mui/material";
import { Clear, RestartAlt, FilterAlt } from "@mui/icons-material";
import NotasClienteAutocomplete from "./NotasClienteAutocomplete";
import DatePicker from "react-datepicker";

const NotasFilters = ({
  clientes,
  clienteFilter,
  setClienteFilter,
  startDate,
  endDate,
  setDateRange,
  handleResetFilter,
}) => {
  const hasActiveFilters = clienteFilter || startDate || endDate;

  return (
    <Box sx={{ mb: 3, mt: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* <NotasClienteAutocomplete
          value={clienteFilter}
          onChange={setClienteFilter}
          sx={{ minWidth: 280 }}
        /> */}

        <FormControl size="medium">
          <DatePicker
            locale={"es"}
            dateFormat="dd/MM/yyyy"
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={setDateRange}
            placeholderText="Seleccionar rango de fechas"
            isClearable={startDate || endDate}
            customInput={
              <TextField
                label="Rango de Fechas"
                size="medium"
                sx={{ minWidth: 250 }}
                InputProps={{
                  endAdornment: (startDate || endDate) && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateRange([null, null]);
                        }}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            }
          />
        </FormControl>

        {hasActiveFilters && (
          <Tooltip title="Limpiar todos los filtros" arrow>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResetFilter}
              startIcon={<RestartAlt />}
              size="medium"
            >
              Limpiar Filtros
            </Button>
          </Tooltip>
        )}

        {hasActiveFilters && (
          <Box sx={{ ml: "auto" }}>
            <Chip
              icon={<FilterAlt />}
              label={`${[
                clienteFilter ? "1 cliente" : "",
                startDate || endDate ? "1 rango de fechas" : "",
              ]
                .filter(Boolean)
                .join(", ")} aplicado(s)`}
              color="primary"
              variant="outlined"
              size="medium"
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default NotasFilters;
