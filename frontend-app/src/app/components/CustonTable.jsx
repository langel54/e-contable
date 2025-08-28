import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/material"; // Importa styled de MUI
import { esLocaleText } from "./esLocate";

// Estilos con styled de MUI
const TableContainer = styled(Box)(({ theme }) => ({
  // width: "100%",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(2),
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
  "& .MuiDataGrid-cell": {
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f5f5f5",
    fontWeight: "600 !important",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#f0f0f0",
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#f9f9f9",
  },
  "& .MuiDataGrid-row": {
    borderBottom: "1px solid #f0f0f0", // Agrega un borde a las filas
  },
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
