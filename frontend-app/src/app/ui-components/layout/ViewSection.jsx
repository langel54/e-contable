import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";

/**
 * Bloque de vista con cabecera (título + acción) y contenido flexible (tabla, formulario, etc.).
 */
export default function ViewSection({
  title,
  subtitle,
  icon,
  action,
  children,
  sx = {},
  contentSx = {},
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        width: "100%",
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2, flexShrink: 0 }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
          {icon && (
            <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {icon}
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Stack>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          ...contentSx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

ViewSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  children: PropTypes.node,
  sx: PropTypes.object,
  contentSx: PropTypes.object,
};
