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
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Clear, RestartAlt, MoreVert } from "@mui/icons-material";
import { FileExcelFilled, FilePdfFilled } from "@ant-design/icons";
import YearPickerField from "@/app/components/YearPickerField";
import DatePicker from "react-datepicker";
import FilterToolbar, { FilterField } from "@/app/ui-components/layout/FilterToolbar";
import { FILTER_LAYOUT } from "@/app/ui-components/layout/layoutConstants";

const ExpensesFilters = ({
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
  setSelectedAnio,
  estados,
  selectedEstado,
  setSelectedEstado,
  handleYearChange,
  renderYearContent,
  handleResetFilter,
  handleClickPop,
  anchorElPop,
  handleActionOpen,
  handleGenerateExcel,
  handleGeneratePDF,
  exportingExcel,
}) => (
  <>
    <FilterToolbar
      sx={{ mb: 0 }}
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
                        size="small"
                        onClick={() => setDateRange([null, null])}
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
          <Select value={periodo} label="Periodo" onChange={(e) => setPeriodo(e.target.value)}>
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
          onChange={(date) => handleYearChange(date, setSelectedAnio)}
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

    <Popover
      open={Boolean(anchorElPop)}
      anchorEl={anchorElPop}
      onClose={handleActionOpen}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <List>
        <ListItem sx={{ cursor: "pointer" }} onClick={handleGenerateExcel} disabled={exportingExcel}>
          <ListItemIcon sx={(theme) => ({ color: theme.palette.success.main })}>
            {exportingExcel ? (
              <CircularProgress size={20} color="success" />
            ) : (
              <FileExcelFilled />
            )}
          </ListItemIcon>
          <ListItemText primary={exportingExcel ? "Exportando..." : "Exportar Excel"} />
        </ListItem>
        <Divider />
        <ListItem sx={{ cursor: "pointer" }} onClick={handleGeneratePDF}>
          <ListItemIcon sx={(theme) => ({ color: theme.palette.error.main })}>
            <FilePdfFilled />
          </ListItemIcon>
          <ListItemText primary="Imprimir PDF" />
        </ListItem>
      </List>
    </Popover>
  </>
);

export default ExpensesFilters;
