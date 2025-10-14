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
import { Clear, RestartAlt } from "@mui/icons-material";
import DatePicker from "react-datepicker";

const NotasFilters = ({
  clientes,
  clienteFilter,
  setClienteFilter,
  startDate,
  endDate,
  setDateRange,
  handleResetFilter,
}) => (
  <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }} width={"100%"}>
    <Stack direction={"row"} justifyContent={"start"} spacing={2}>
      <FormControl sx={{ width: 250 }}>
        <InputLabel>Empresa/Cliente</InputLabel>
        <Select
          sx={{ pr: 3 }}
          value={clienteFilter}
          onChange={(e) => setClienteFilter(e.target.value)}
          displayEmpty
          label="Selecciona empresa/cliente"
          input={
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  {clienteFilter && (
                    <IconButton size="small" edge="end" onClick={() => setClienteFilter("")}
                      sx={{ borderRadius: "50%" }}>
                      <Clear sx={{ height: 14 }} />
                    </IconButton>
                  )}
                </InputAdornment>
              }
            />
          }
        >
          <MenuItem value="">Todos</MenuItem>
          {clientes.map((c) => (
            <MenuItem key={c.idclienteprov} value={c.idclienteprov}>
              {c.razonsocial}
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
              label="Fecha de nota"
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
    </Stack>
    <Stack direction={"row"} spacing={1}>
      <Tooltip arrow title="Quitar Filtros" placement="left">
        <IconButton onClick={handleResetFilter}>
          <RestartAlt />
        </IconButton>
      </Tooltip>
    </Stack>
  </Stack>
);

export default NotasFilters;
