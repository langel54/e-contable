import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { esLocaleText } from "./esLocate";
import InboxOutlined from "@ant-design/icons/InboxOutlined";
import { VIEW_LAYOUT } from "@/app/ui-components/layout/layoutConstants";

const TableContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "fill",
})(({ theme, fill }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.customShadows?.z1,
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",
  transition: "box-shadow 0.2s ease",
  width: "100%",
  ...(fill
    ? {
        flex: 1,
        minHeight: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }
    : {}),
  "&:hover": {
    boxShadow: theme.customShadows?.z2,
  },
}));

const DataGridStyled = styled(DataGrid, {
  shouldForwardProp: (prop) => prop !== "gridHeight",
})(({ gridHeight }) => ({
  border: "none",
  width: "100%",
  ...(gridHeight != null
    ? {
        height: gridHeight,
        minHeight:
          gridHeight === "100%"
            ? VIEW_LAYOUT.tableMinHeight
            : typeof gridHeight === "number"
              ? gridHeight
              : gridHeight,
      }
    : { minHeight: 400 }),
}));

const EmptyStateContainer = styled(Box)(({ theme, minH }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: minH || 280,
  flex: 1,
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
    height,
    fill = false,
    minHeight,
  }) => {
    const hasData = data && data.length > 0;
    const showEmptyState = !loading && !hasData;

    const gridHeight = height ?? (fill ? "100%" : undefined);
    const emptyMinH =
      minHeight ??
      (fill
        ? VIEW_LAYOUT.halfViewportTable.xs
        : height && typeof height === "number"
          ? height
          : 280);

    if (showEmptyState) {
      return (
        <TableContainer fill={fill}>
          <EmptyStateContainer minH={emptyMinH}>
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
      <TableContainer fill={fill}>
        <DataGridStyled
          gridHeight={gridHeight}
          rows={data || []}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          rowCount={rowCount}
          paginationMode={paginationMode}
          loading={loading}
          getRowId={getRowId}
          rowHeight={48}
          disableColumnMenu
          localeText={esLocaleText}
          slots={{
            noRowsOverlay: () => (
              <EmptyStateContainer minH={emptyMinH}>
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

CustomTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  paginationModel: PropTypes.object,
  setPaginationModel: PropTypes.func,
  rowCount: PropTypes.number,
  loading: PropTypes.bool,
  getRowId: PropTypes.func,
  paginationMode: PropTypes.string,
  emptyMessage: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fill: PropTypes.bool,
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default CustomTable;
