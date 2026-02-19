import PropTypes from "prop-types";

// material-ui
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// project import
// import MainCard from "../ui-components/MainCard";

// assets
import RiseOutlined from "@ant-design/icons/RiseOutlined";
import FallOutlined from "@ant-design/icons/FallOutlined";
import MainCard from "../../MainCard";

const iconSX = {
  fontSize: "0.75rem",
  color: "inherit",
  marginLeft: 0,
  marginRight: 0,
};

export default function AnalyticEcommerce({
  color = "primary",
  title,
  count,
  percentage,
  isLoss,
  extra,
}) {
  return (
    <MainCard
      contentSX={{ p: 2.25 }}
      sx={{
        position: "relative",
        overflow: "hidden", // Crucial para que el borde no se salga de las esquinas
        borderRadius: "12px", // Asegúrate que coincida con el radio de tu MainCard

        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "inherit", // Esto hace que el borde siga la curva de la tarjeta
          pointerEvents: "none",
          borderBottom: (theme) => 
            `2px solid ${theme.palette[color]?.main || theme.palette.primary.main}`,
          transition: "all 0.25s ease",
        },

        "&:hover::after": {
          borderBottomWidth: "4px",
        },
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h3" fontWeight={700} color="text.primary">
              {count}
            </Typography>
          </Grid>
          {(percentage || percentage == "0") && (
            <Grid item>
              <Chip
                variant="combined"
                color={color}
                icon={
                  isLoss ? (
                    <FallOutlined style={iconSX} />
                  ) : (
                    <RiseOutlined style={iconSX} />
                  )
                }
                label={`${percentage}%`}
                sx={{ ml: 1.25, pl: 1 }}
                size="small"
              />
            </Grid>
          )}
        </Grid>
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="text.secondary">
          <Typography
            variant="caption"
            // sx={{ color: `${color || "primary"}.main` }}
          >
            {extra}
          </Typography>{" "}
        </Typography>
      </Box>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string,
};
