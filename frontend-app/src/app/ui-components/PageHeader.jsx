import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

export default function PageHeader({ title, subtitle, action }) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
          color="text.primary"
          sx={{ letterSpacing: "-0.025em", lineHeight: 1.2 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
            {subtitle}
          </Typography>
        )}
        <Box
          sx={{
            mt: 1.5,
            width: 48,
            height: 3,
            borderRadius: 1,
            background: `linear-gradient(90deg, ${primary}, ${alpha(primary, 0.25)})`,
          }}
        />
      </Box>
      {action && <Box sx={{ flexShrink: 0, width: { xs: "100%", sm: "auto" } }}>{action}</Box>}
    </Stack>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
};
