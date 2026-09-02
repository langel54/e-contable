import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { FILTER_LAYOUT } from "./layoutConstants";

/** Campo dentro de la grilla de filtros */
export function FilterField({ children, grow = false, fullWidth = false, sx = {} }) {
  const layoutSx = fullWidth
    ? FILTER_LAYOUT.fieldFull
    : grow
      ? FILTER_LAYOUT.fieldGrow
      : FILTER_LAYOUT.field;

  return (
    <Box sx={{ ...layoutSx, ...sx }}>
      {children}
    </Box>
  );
}

FilterField.propTypes = {
  children: PropTypes.node,
  grow: PropTypes.bool,
  fullWidth: PropTypes.bool,
  sx: PropTypes.object,
};

/**
 * Contenedor responsive para filtros (TextField, Select, DatePicker, botones).
 */
export default function FilterToolbar({ children, actions, sx = {} }) {
  return (
    <Box sx={{ width: "100%", minWidth: 0, ...sx }}>
      <Box sx={FILTER_LAYOUT.toolbar}>{children}</Box>
      {actions ? (
        <Box sx={{ ...FILTER_LAYOUT.actionsRow, mt: 2 }}>{actions}</Box>
      ) : null}
    </Box>
  );
}

FilterToolbar.propTypes = {
  children: PropTypes.node,
  actions: PropTypes.node,
  sx: PropTypes.object,
};
