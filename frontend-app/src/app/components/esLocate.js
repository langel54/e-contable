export const esLocaleText = {
  // Paginación
  MuiTablePagination: {
    labelRowsPerPage: "Filas por página:",
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
  },

  // Texto de DataGrid
  noRowsLabel: "No hay filas",
  noResultsOverlayLabel: "No se encontraron resultados",

  // Filtros
  toolbarFilters: "Filtros",
  toolbarFiltersLabel: "Mostrar filtros",
  toolbarFiltersTooltipHide: "Ocultar filtros",
  toolbarFiltersTooltipShow: "Mostrar filtros",
  toolbarFiltersTooltipActive: (count) =>
    `${count} filtro${count !== 1 ? "s" : ""} activo${count !== 1 ? "s" : ""}`,

  // Columnas
  columnMenuLabel: "Menú",
  columnMenuShowColumns: "Mostrar columnas",
  columnMenuManageColumns: "Administrar columnas",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar columna",
  columnMenuUnsort: "Deshacer orden",
  columnMenuSortAsc: "Ordenar ascendente",
  columnMenuSortDesc: "Ordenar descendente",

  // Selector de columnas
  columnsPanelTextFieldLabel: "Buscar columna",
  columnsPanelTextFieldPlaceholder: "Título de columna",
  columnsPanelDragIconLabel: "Reordenar columna",
  columnsPanelShowAllButton: "Mostrar todo",
  columnsPanelHideAllButton: "Ocultar todo",

  // Selector de densidad
  toolbarDensity: "Densidad",
  toolbarDensityLabel: "Densidad",
  toolbarDensityCompact: "Compacto",
  toolbarDensityStandard: "Estándar",
  toolbarDensityComfortable: "Cómodo",

  // Exportación
  toolbarExport: "Exportar",
  toolbarExportLabel: "Exportar",
  toolbarExportCSV: "Descargar CSV",
  toolbarExportPrint: "Imprimir",

  // Selección
  checkboxSelectionHeaderName: "Selección",
  checkboxSelectionSelectAllRows: "Seleccionar todas las filas",
  checkboxSelectionUnselectAllRows: "Deseleccionar todas las filas",

  // Búsqueda
  searchTooltip: "Buscar",

  // Otros
  errorOverlayDefaultLabel: "Ocurrió un error",
  footerRowSelected: (count) =>
    `${count} fila${count !== 1 ? "s" : ""} seleccionada${
      count !== 1 ? "s" : ""
    }`,
  columnMenuSortAsc: "Ordenar de A-Z",
  columnMenuSortDesc: "Ordenar de Z-A",
  columnMenuUnsort: "Deshacer ordenación",

  // Botones de navegación
  footerPaginationRowsPerPage: "Filas por página",
  footerPaginationFirst: "Primera página",
  footerPaginationLast: "Última página",
  footerPaginationPrevious: "Página anterior",
  footerPaginationNext: "Página siguiente",
  MuiTablePagination: {
    labelRowsPerPage: "Filas por página:",
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
  },
  // Títulos y tooltips generales
  toolbarColumnsLabel: "Columnas",
  toolbarFiltersLabel: "Filtros",
  toolbarDensityLabel: "Densidad",
  toolbarExportLabel: "Exportar",

  // Tooltips de columnas
  columnMenuLabel: "Menú",
  columnMenuShowColumns: "Mostrar columnas",
  columnMenuManageColumns: "Administrar columnas",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar columna",
  columnMenuSortAsc: "Ordenar ascendente",
  columnMenuSortDesc: "Ordenar descendente",

  // Tooltips de herramientas
  toolbarFiltersTooltipShow: "Mostrar filtros",
  toolbarFiltersTooltipHide: "Ocultar filtros",
  toolbarFiltersTooltipActive: (count) =>
    `${count} filtro${count !== 1 ? "s" : ""} activo${count !== 1 ? "s" : ""}`,

  // Tooltips de exportación
  toolbarExportCSV: "Descargar CSV",
  toolbarExportPrint: "Imprimir",

  // Tooltips de densidad
  toolbarDensityCompact: "Compacto",
  toolbarDensityStandard: "Estándar",
  toolbarDensityComfortable: "Cómodo",

  // Otros tooltips
  checkboxSelectionHeaderName: "Selección múltiple",
  searchTooltip: "Buscar",
  
};
