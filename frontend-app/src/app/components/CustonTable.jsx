import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/material"; // Importa styled de MUI
import { esLocaleText } from "./esLocate";

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
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.6)' : theme.palette.grey[50],
    color: theme.palette.text.primary,
    fontWeight: "700 !important",
    borderBottom: `2px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(8px)',
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : theme.palette.grey[100],
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.6)' : theme.palette.grey[50],
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
  }
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
  }) => {
    return (
      <TableContainer>
        {/* {loading ? (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        ) : ( */}
        <DataGridStyled
          rows={data}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          rowCount={rowCount}
          paginationMode="server"
          loading={loading}
          getRowId={getRowId}
          rowHeight={54}
          // density="compact"
          disableColumnMenu={true} // Desactiva el menú de las columnas
          localeText={esLocaleText}
        />
        {/* )} */}
      </TableContainer>
    );
  }
);

export default CustomTable;
