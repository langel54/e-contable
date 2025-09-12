import React from "react";
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Tooltip,
  Divider,
} from "@mui/material";
import { Clear, RestartAlt, MoreVert } from "@mui/icons-material";
import DatePicker from "react-datepicker";

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
  setSelectedAnio,
  estados,
  selectedEstado,
  setSelectedEstado,
  handleYearChange,
  renderYearContent,
  handleResetFilter,
  handleClickPop,
}) => (
  <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }} width={"100%"}>
    <Stack direction={"row"} justifyContent={"start"} spacing={2}>
      <FormControl sx={{ width: 250 }}>
        <InputLabel>Concepto</InputLabel>
        <Select
          sx={{ pr: 3 }}
          value={conceptFilter}
          onChange={(e) => setConceptFilter(e.target.value)}
          displayEmpty
          label="Selecciona un concepto"
          input={
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  {conceptFilter && (
                    <IconButton size="small" edge="end" onClick={() => setConceptFilter("")}
                      sx={{ borderRadius: "50%" }}>
                      <Clear sx={{ height: 14 }} />
                    </IconButton>
                  )}
                </InputAdornment>
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
      <FormControl>
        <DatePicker
          locale={"es"}
          dateFormat="dd/MM/yyyy "
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={setDateRange}
          customInput={
            <TextField
              label="Fecha de pago"
              autoComplete={false}
              slotProps={{
                input: {
                  endAdornment: (startDate || endDate) && (
                    <InputAdornment position="end">
                      <IconButton sx={{ borderRadius: "50%" }} onClick={() => setDateRange([null, null])} size="small">
                        <Clear sx={{ height: 14 }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          }
        />
      </FormControl>
      <FormControl size="medium" sx={{ width: 100 }}>
        <InputLabel>Periodo</InputLabel>
        <Select value={periodo} name="idperiodo" onChange={(e) => setPeriodo(e.target.value)}>
          <MenuItem value="">Todos</MenuItem>
          {periodosList.map((period) => (
            <MenuItem key={period.idperiodo} value={period.idperiodo}>
              {period.nom_periodo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="medium" sx={{ width: 150 }}>
        <DatePicker
          selected={selectedAnio ? new Date(selectedAnio, 0, 1) : null}
          onChange={handleYearChange}
          showYearPicker
          dateFormat="yyyy"
          renderYearContent={renderYearContent}
          customInput={
            <TextField
              label="Seleccionar Año"
              value={selectedAnio || ""}
              InputProps={{ readOnly: true }}
            />
          }
        />
      </FormControl>
      <FormControl size="medium" sx={{ width: 150 }}>
        <InputLabel>Estado</InputLabel>
        <Select value={selectedEstado} onChange={(e) => setSelectedEstado(e.target.value)}>
          <MenuItem value="">Todos</MenuItem>
          {estados.map((estatus) => (
            <MenuItem key={estatus.idestado} value={estatus.idestado}>
              {estatus.nom_estado}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
    <Stack direction={"row"} spacing={1}>
      <Tooltip arrow title="Quitar FIltros" placement="left">
        <IconButton onClick={handleResetFilter}>
          <RestartAlt />
        </IconButton>
      </Tooltip>
      <IconButton onClick={handleClickPop}>
        <MoreVert />
      </IconButton>
    </Stack>
  </Stack>
);

export default IncomesFilters;
