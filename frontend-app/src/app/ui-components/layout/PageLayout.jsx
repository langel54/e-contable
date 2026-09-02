import PropTypes from "prop-types";
import { Box } from "@mui/material";
import PageHeader from "@/app/ui-components/PageHeader";

/**
 * Contenedor de página (sin padding extra: el main del drawer ya aporta márgenes).
 */
export default function PageLayout({ title, subtitle, action, children, sx = {} }) {
  return (
    <Box sx={{ width: "100%", minWidth: 0, ...sx }}>
      {(title || action) && (
        <PageHeader title={title} subtitle={subtitle} action={action} />
      )}
      {children}
    </Box>
  );
}

PageLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};
