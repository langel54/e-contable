import { Grid, Typography, Divider, Paper, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const gradientColors = [
  { start: "#e3f2fd", end: "#fff", title: "#1565c0" }, // Azul más oscuro
  { start: "#f3e5f5", end: "#fff", title: "#6a1b9a" }, // Morado más oscuro
  { start: "#e8f5e9", end: "#fff", title: "#1b5e20" }, // Verde más oscuro
  { start: "#fff3e0", end: "#fff", title: "#e65100" }, // Naranja más oscuro
  { start: "#f5f5f5", end: "#fff", title: "#424242" }, // Gris para "Otros Datos"
];

const StyledPaper = styled(Paper)(({ theme, gradient }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(135deg, ${gradient.start}, ${gradient.end})`,
}));

export default function ClientDetailsModal({ data }) {
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
        {},
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
        { label: "Libro Electronico", key: "libro_elect" },
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
  ];

  // Sacar las keys ya usadas
  const usedKeys = groups.flatMap((g) => g.fields.map((f) => f.key));

  // Filtrar datos que no estén en los grupos
  const otherFields = Object.keys(data)
    .filter((key) => !usedKeys.includes(key))
    .map((key) => ({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), // Etiqueta legible
      key,
    }));

  return (
    <Box p={2}>
      {groups.map((group, i) => (
        <StyledPaper key={i} gradient={gradientColors[i]}>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              color: gradientColors[i].title,
              fontWeight: "bold",
            }}
          >
            {group.title}
          </Typography>
          <Divider sx={{ mb: 2, borderColor: gradientColors[i].title }} />
          <Grid container spacing={1}>
            {group.fields.map((field, j) => (
              <Grid item xs={6} key={`${i}-${field.key}`}>
                <Typography variant="body2" color="textSecondary">
                  {field.label}
                </Typography>
                <Typography variant="body1">
                  {data[field.key] || "-"}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      ))}

      {/* Otros datos dinámicos */}
      {otherFields.length > 0 && (
        <StyledPaper gradient={gradientColors[4]}>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              color: gradientColors[4].title,
              fontWeight: "bold",
            }}
          >
            Otros Datos
          </Typography>
          <Divider sx={{ mb: 2, borderColor: gradientColors[4].title }} />
          <Grid container spacing={1}>
            {otherFields.map((field) => (
              <Grid item xs={6} key={field.key}>
                <Typography variant="body2" color="textSecondary">
                  {field.label}
                </Typography>
                <Typography variant="body1">
                  {data[field.key] || "-"}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}
    </Box>
  );
}
