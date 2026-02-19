import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { esLocaleText } from "./esLocate";
import InboxOutlined from "@ant-design/icons/InboxOutlined";

// Estilos con styled de MUI
const TableContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.customShadows.z1,
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.customShadows.z2,
  },
}));

const LoadingContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "650px",
});

const DataGridStyled = styled(DataGrid)(({ theme }) => ({
  minHeight: "650px",
  border: "none",
  fontFamily: theme.typography.fontFamily,
  '& .MuiDataGrid-main': {
    borderRadius: theme.spacing(2),
  },
  "& .MuiDataGrid-cell": {
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.text.primary,
    fontWeight: "700 !important",
    borderBottom: `2px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(8px)',
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.text.secondary,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiDataGrid-row": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: 'background-color 0.2s ease',
  },
  '& .MuiTablePagination-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiIconButton-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiDataGrid-scrollbar': {
    zIndex: 1, // Reducir de 6 a 1 para evitar que se superponga a otros elementos
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "400px",
  gap: theme.spacing(2),
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const CustomTable = React.memo(
  ({
    columns,
    data,
    paginationModel,
    setPaginationModel,
    rowCount,
    loading,
    getRowId,
    paginationMode = "server",
    emptyMessage = "No se encontraron registros",
  }) => {
    // Si no está cargando y no hay datos, mostrar estado vacío
    const hasData = data && data.length > 0;
    const showEmptyState = !loading && !hasData;

    if (showEmptyState) {
      return (
        <TableContainer>
          <EmptyStateContainer>
            <InboxOutlined style={{ fontSize: 64, opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary">
              {emptyMessage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta ajustar los filtros de búsqueda
            </Typography>
          </EmptyStateContainer>
        </TableContainer>
      );
    }

    return (
      <TableContainer>
        <DataGridStyled
          rows={data || []}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          rowCount={rowCount}
          paginationMode={paginationMode}
          loading={loading}
          getRowId={getRowId}
          rowHeight={54}
          disableColumnMenu={true}
          localeText={esLocaleText}
          slots={{
            noRowsOverlay: () => (
              <EmptyStateContainer>
                <InboxOutlined style={{ fontSize: 64, opacity: 0.3 }} />
                <Typography variant="h6" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </EmptyStateContainer>
            ),
          }}
        />
      </TableContainer>
    );
  }
);

export default CustomTable;
