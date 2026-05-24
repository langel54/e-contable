/** Espaciados y alturas unificados para vistas del ERP */
export const VIEW_LAYOUT = {
  gridSpacing: 2.5,
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
