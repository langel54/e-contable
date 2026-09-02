/** Espaciados y alturas unificados para vistas del ERP */
export const VIEW_LAYOUT = {
  gridSpacing: 2.5,
  sectionGap: 2.5,
  /** Altura mínima del bloque dividido (dos tablas lado a lado en desktop) */
  splitViewportHeight: {
    xs: "auto",
    lg: "calc(100vh - 240px)",
  },
  /** Cada tabla ocupa ~mitad de pantalla en móvil (apiladas) */
  halfViewportTable: {
    xs: "calc(50vh - 200px)",
    lg: "100%",
  },
  tableMinHeight: 280,
  fullTableMinHeight: "calc(100vh - 280px)",
};

/** Barra de filtros responsive (inputs, selects, botones) */
export const FILTER_LAYOUT = {
  toolbar: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(auto-fill, minmax(180px, 1fr))",
    },
    gap: 2,
    alignItems: "end",
    width: "100%",
  },
  fieldGrow: {
    gridColumn: { xs: "1 / -1", lg: "span 2" },
    minWidth: 0,
    width: "100%",
  },
  fieldFull: {
    gridColumn: "1 / -1",
    minWidth: 0,
    width: "100%",
  },
  field: {
    minWidth: 0,
    width: "100%",
  },
  actionsRow: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    flexWrap: "wrap",
    gap: 1.5,
    alignItems: { xs: "stretch", sm: "center" },
    justifyContent: { xs: "stretch", sm: "flex-end" },
    width: "100%",
    "& > .MuiButton-root": {
      width: { xs: "100%", sm: "auto" },
    },
  },
  formControl: {
    width: "100%",
    minWidth: 0,
  },
  cardContent: {
    p: { xs: 2, sm: 2.5 },
    "&:last-child": { pb: { xs: 2, sm: 2.5 } },
  },
};
