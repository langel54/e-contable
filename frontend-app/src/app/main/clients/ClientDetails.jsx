import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Divider,
  Paper,
  Box,
  useTheme,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import SettingsIcon from "@mui/icons-material/Settings";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";

const gradientColors = [
  { start: "#e3f2fd", end: "#fff", title: "#1565c0", icon: <PersonIcon /> },
  { start: "#f3e5f5", end: "#fff", title: "#6a1b9a", icon: <KeyIcon /> },
  { start: "#e8f5e9", end: "#fff", title: "#1b5e20", icon: <SettingsIcon /> },
  {
    start: "#fff3e0",
    end: "#fff",
    title: "#e65100",
    icon: <MiscellaneousServicesIcon />,
  },
  {
    start: "#f5f5f5",
    end: "#fff",
    title: "#424242",
    icon: <MiscellaneousServicesIcon />,
  },
];

const StyledAccordion = styled(Accordion)(({ gradient }) => ({
  background: `linear-gradient(135deg, ${gradient.start}, ${gradient.end})`,
  borderRadius: 12,
  marginBottom: 8,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
}));

const Label = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 13,
}));

const Value = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  fontSize: 14,
}));

export default function ClientDetailsModal({ data }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const gradientColors = [
    { 
      start: isDark ? "rgba(129, 140, 248, 0.15)" : "#e3f2fd", 
      end: isDark ? "rgba(129, 140, 248, 0.05)" : "#fff", 
      title: isDark ? theme.palette.primary.light : "#1565c0", 
      icon: <PersonIcon sx={{ color: isDark ? 'primary.light' : 'primary.main' }} /> 
    },
    { 
      start: isDark ? "rgba(168, 85, 247, 0.15)" : "#f3e5f5", 
      end: isDark ? "rgba(168, 85, 247, 0.05)" : "#fff", 
      title: isDark ? "#c084fc" : "#6a1b9a", 
      icon: <KeyIcon sx={{ color: isDark ? "#c084fc" : "#6a1b9a" }} /> 
    },
    { 
      start: isDark ? "rgba(34, 197, 94, 0.15)" : "#e8f5e9", 
      end: isDark ? "rgba(34, 197, 94, 0.05)" : "#fff", 
      title: isDark ? "#4ade80" : "#1b5e20", 
      icon: <SettingsIcon sx={{ color: isDark ? "#4ade80" : "#1b5e20" }} /> 
    },
    {
      start: isDark ? "rgba(249, 115, 22, 0.15)" : "#fff3e0",
      end: isDark ? "rgba(249, 115, 22, 0.05)" : "#fff",
      title: isDark ? "#fb923c" : "#e65100",
      icon: <MiscellaneousServicesIcon sx={{ color: isDark ? "#fb923c" : "#e65100" }} />,
    },
    {
      start: isDark ? "rgba(255, 255, 255, 0.05)" : "#f5f5f5",
      end: isDark ? "rgba(255, 255, 255, 0.02)" : "#fff",
      title: isDark ? "text.secondary" : "#424242",
      icon: <MiscellaneousServicesIcon sx={{ color: "text.secondary" }} />,
    },
  ];

  const groups = [
    {
      title: "Datos Generales",
      fields: [
        { label: "Cod. Cliente", key: "idclienteprov" },
        { label: "Razón Social", key: "razonsocial" },
        { label: "RUC", key: "ruc" },
        { label: "DNI", key: "dni" },
        { label: "Dirección", key: "direccion" },
        { label: "Teléfono", key: "telefono" },
        { label: "Fecha Ingreso", key: "fecha_ingreso" },
      ],
    },
    {
      title: "Usuario y Claves",
      fields: [
        { label: "Usuario", key: "c_usuario" },
        { label: "Contraseña", key: "c_passw" },
        { label: "Clave AFPNet", key: "clave_afpnet" },
        { label: "Clave RNP", key: "clave_rnp" },
      ],
    },
    {
      title: "Configuraciones Tributarias",
      fields: [
        { label: "Régimen", key: "nregimen" },
        { label: "Rubro", key: "nrubro" },
        { label: "Factura Electrónica", key: "fact_elect" },
        { label: "Planilla Electrónica", key: "planilla_elect" },
        { label: "Libro Electrónico", key: "libro_elect" },
        { label: "PDT 621", key: "pdt_621" },
        { label: "Sujeta a Retención", key: "sujeta_retencion" },
        { label: "Paga Percepción", key: "paga_percepcion" },
        { label: "PLE desde", key: "ple_desde" },
      ],
    },
    {
      title: "Otros",
      fields: [
        { label: "Honorario Anual", key: "honorario_anual" },
        { label: "Monto Ref.", key: "montoref" },
        { label: "Observaciones", key: "obs" },
      ],
    },
    {
      title: "Facturador Electrónico",
      fields: [
        { label: "Usuario/email", key: "f_usuario" },
        { label: "Contraseña", key: "f_pass" },
        { label: "Facturador", key: "idfacturador" },
      ],
    },
  ];

  const usedKeys = groups.flatMap((g) => g.fields.map((f) => f.key));

  const otherFields = Object.keys(data)
    .filter((key) => !usedKeys.includes(key))
    .map((key) => ({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      key,
    }));

  const allGroups = [...groups, { title: "Otros Datos", fields: otherFields }];

  return (
    <Box p={2}>
      {allGroups.map((group, i) => {
        const colors = gradientColors[i] || gradientColors[4];
        return (
          <StyledAccordion
            key={i}
            gradient={colors}
            sx={{
              '&:before': { display: 'none' },
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              overflow: 'hidden'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
              sx={{
                background: colors.start,
                borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0,0,0,0.05)",
                minHeight: 56,
                '& .MuiAccordionSummary-content': { margin: '12px 0' }
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                {colors.icon}
                <Typography
                  variant="subtitle1"
                  sx={{ 
                    fontWeight: 600, 
                    color: colors.title,
                    letterSpacing: '0.02em'
                  }}
                >
                  {group.title}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: isDark ? 'rgba(0,0,0,0.1)' : 'transparent' }}>
              <Grid container spacing={3} sx={{ p: 1 }}>
                {group.fields.map(
                  (field, j) =>
                    field.key && (
                      <Grid item xs={12} sm={6} key={`${i}-${j}`}>
                        <Stack spacing={0.5}>
                          <Label>{field.label}</Label>
                          <Value>{data[field.key] || "-"}</Value>
                        </Stack>
                        <Divider sx={{ mt: 1, opacity: isDark ? 0.3 : 0.8 }} />
                      </Grid>
                    )
                )}
              </Grid>
            </AccordionDetails>
          </StyledAccordion>
        );
      })}
    </Box>
  );
}
