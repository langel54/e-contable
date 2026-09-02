import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";

/** Título de sección para bloques de gráficos/tablas en dashboards ERP. */
export default function SectionTitle({ children, action }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ letterSpacing: "-0.02em" }}
      >
        {children}
      </Typography>
      {action}
    </Stack>
  );
}

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  action: PropTypes.node,
};
