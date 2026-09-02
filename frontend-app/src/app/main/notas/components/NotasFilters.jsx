import React from "react";
import {
  FormControl,
  InputAdornment,
  IconButton,
  TextField,
  Tooltip,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { Clear, RestartAlt, FilterAlt } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import FilterToolbar, { FilterField } from "@/app/ui-components/layout/FilterToolbar";

const NotasFilters = ({
  clienteFilter,
  startDate,
  endDate,
  setDateRange,
  handleResetFilter,
}) => {
  const hasActiveFilters = clienteFilter || startDate || endDate;

  return (
    <Box sx={{ mb: 3 }}>
      <FilterToolbar
        actions={
          hasActiveFilters ? (
            <>
              <Tooltip title="Limpiar todos los filtros" arrow>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleResetFilter}
                  startIcon={<RestartAlt />}
                  size="small"
                >
                  Limpiar filtros
                </Button>
              </Tooltip>
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
                size="small"
              />
            </>
          ) : null
        }
      >
        <FilterField grow>
          <FormControl size="small" sx={{ width: "100%" }}>
            <DatePicker
              locale="es"
              dateFormat="dd/MM/yyyy"
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={setDateRange}
              placeholderText="Seleccionar rango de fechas"
              isClearable={startDate || endDate}
              customInput={
                <TextField
                  fullWidth
                  size="small"
                  label="Rango de fechas"
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
        </FilterField>
      </FilterToolbar>
    </Box>
  );
};

export default NotasFilters;
