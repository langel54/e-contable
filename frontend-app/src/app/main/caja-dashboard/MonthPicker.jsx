import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const MONTHS = [
  { value: "", label: "Todos" },
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const MonthSelect = ({ value, onChange, sx = {} }) => {
  return (
    <FormControl fullWidth size="small" sx={{ minWidth: 0, ...sx }}>
      <InputLabel id="month-picker-label">Mes</InputLabel>
      <Select
        labelId="month-picker-label"
        label="Mes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {MONTHS.map((m) => (
          <MenuItem key={m.value} value={m.value}>
            {m.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MonthSelect;
