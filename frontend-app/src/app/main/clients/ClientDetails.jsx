import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Divider,
  Paper,
  Box,
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
  // console.log("🚀 ~ ClientDetailsModal ~ data:", data);
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
      {allGroups.map((group, i) => (
        <StyledAccordion
          key={i}
          gradient={gradientColors[i] || gradientColors[4]}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              background: gradientColors[i]?.start,
              borderBottom: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              {gradientColors[i]?.icon}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color={gradientColors[i]?.title}
              >
                {group.title}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1.5}>
              {group.fields.map(
                (field, j) =>
                  field.key && (
                    <Grid item xs={12} sm={6} key={`${i}-${j}`}>
                      <Label>{field.label}</Label>
                      <Value>{data[field.key] || "-"}</Value>
                      <Divider sx={{ my: 0.5 }} />
                    </Grid>
                  )
              )}
            </Grid>
          </AccordionDetails>
        </StyledAccordion>
      ))}
    </Box>
  );
}
