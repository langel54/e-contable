import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Clear, RestartAlt, MoreVert } from "@mui/icons-material";
import YearPickerField from "@/app/components/YearPickerField";
import DatePicker from "react-datepicker";
import FilterToolbar, { FilterField } from "@/app/ui-components/layout/FilterToolbar";
import { FILTER_LAYOUT } from "@/app/ui-components/layout/layoutConstants";

const IncomesFilters = ({
  conceptos,
  conceptFilter,
  setConceptFilter,
  startDate,
  endDate,
  setDateRange,
  periodosList,
  periodo,
  setPeriodo,
  selectedAnio,
  estados,
  selectedEstado,
  setSelectedEstado,
  handleYearChange,
  renderYearContent,
  handleResetFilter,
  handleClickPop,
}) => (
  <FilterToolbar
    sx={{ mb: 2, mt: 1 }}
    actions={
      <>
        <Tooltip arrow title="Quitar filtros" placement="top">
          <IconButton onClick={handleResetFilter} size="small" aria-label="limpiar filtros">
            <RestartAlt />
          </IconButton>
        </Tooltip>
        <IconButton onClick={handleClickPop} size="small" aria-label="más acciones">
          <MoreVert />
        </IconButton>
      </>
    }
  >
    <FilterField>
      <FormControl size="small" sx={FILTER_LAYOUT.formControl}>
        <InputLabel>Concepto</InputLabel>
        <Select
          value={conceptFilter}
          onChange={(e) => setConceptFilter(e.target.value)}
          label="Concepto"
          input={
            <OutlinedInput
              label="Concepto"
              endAdornment={
                conceptFilter ? (
                  <InputAdornment position="end">
                    <IconButton size="small" edge="end" onClick={() => setConceptFilter("")}>
                      <Clear sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          }
        >
          {conceptos.map((c) => (
            <MenuItem key={c.idconcepto} value={c.idconcepto}>
              {c.nombre_concepto}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FilterField>

    <FilterField>
      <DatePicker
        locale="es"
        dateFormat="dd/MM/yyyy"
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={setDateRange}
        customInput={
          <TextField
            fullWidth
            size="small"
            label="Fecha de pago"
            autoComplete="off"
            slotProps={{
              input: {
                endAdornment: (startDate || endDate) && (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ borderRadius: "50%" }}
                      onClick={() => setDateRange([null, null])}
                      size="small"
                    >
                      <Clear sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        }
      />
    </FilterField>

    <FilterField>
      <FormControl size="small" sx={FILTER_LAYOUT.formControl}>
        <InputLabel>Periodo</InputLabel>
        <Select value={periodo} name="idperiodo" label="Periodo" onChange={(e) => setPeriodo(e.target.value)}>
          <MenuItem value="">Todos</MenuItem>
          {periodosList.map((period) => (
            <MenuItem key={period.idperiodo} value={period.idperiodo}>
              {period.nom_periodo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FilterField>

    <FilterField>
      <YearPickerField
        selected={selectedAnio || null}
        onChange={handleYearChange}
        renderYearContent={renderYearContent}
      />
    </FilterField>

    <FilterField>
      <FormControl size="small" sx={FILTER_LAYOUT.formControl}>
        <InputLabel>Estado</InputLabel>
        <Select value={selectedEstado} label="Estado" onChange={(e) => setSelectedEstado(e.target.value)}>
          <MenuItem value="">Todos</MenuItem>
          {estados.map((estatus) => (
            <MenuItem key={estatus.idestado} value={estatus.idestado}>
              {estatus.nom_estado}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FilterField>
  </FilterToolbar>
);

export default IncomesFilters;
