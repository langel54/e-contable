import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import RiseOutlined from "@ant-design/icons/RiseOutlined";
import FallOutlined from "@ant-design/icons/FallOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { getKpiCardSx, getKpiIconSx } from "@/app/themes/appTokens";
import MainCard from "../../MainCard";

const iconSX = { fontSize: "0.7rem", color: "inherit" };

const colorMap = {
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

const metricIcons = {
  primary: TrendingUpRoundedIcon,
  secondary: InsightsRoundedIcon,
  success: CheckCircleOutlineRoundedIcon,
  error: ErrorOutlineRoundedIcon,
  warning: WarningAmberRoundedIcon,
  info: InfoOutlinedIcon,
};

export default function AnalyticEcommerce({
  color = "primary",
  title,
  count,
  percentage,
  isLoss,
  extra,
}) {
  const theme = useTheme();
  const paletteKey = colorMap[String(color).toLowerCase()] || "primary";
  const accent = theme.palette[paletteKey]?.main || theme.palette.primary.main;
  const MetricIcon = metricIcons[paletteKey] || metricIcons.primary;

  const showPercentage =
    percentage !== undefined && percentage !== null && percentage !== "";

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <MainCard
        border={false}
        boxShadow={false}
        contentSX={{
          p: 2.5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          "&:last-child": { pb: 2.5 },
        }}
        sx={getKpiCardSx(theme, accent)}
      >
        <Stack spacing={2} sx={{ flex: 1, position: "relative", zIndex: 1 }}>
          <Stack direction="row" alignItems="flex-start" spacing={1.5}>
            <Box sx={getKpiIconSx(theme, accent)}>
              <MetricIcon sx={{ fontSize: 23 }} />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
              sx={{ lineHeight: 1.4, pt: 0.35, flex: 1 }}
            >
              {title}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap" useFlexGap>
            <Typography
              variant="h4"
              component="p"
              fontWeight={700}
              color="text.primary"
              sx={{
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                m: 0,
              }}
            >
              {count}
            </Typography>
            {showPercentage && (
              <Chip
                variant="combined"
                color={paletteKey}
                size="small"
                icon={
                  isLoss ? (
                    <FallOutlined style={iconSX} />
                  ) : (
                    <RiseOutlined style={iconSX} />
                  )
                }
                label={`${percentage}%`}
                sx={{ fontWeight: 600, height: 24 }}
              />
            )}
          </Stack>

          {extra && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1.5, mt: "auto", opacity: 0.9 }}
            >
              {extra}
            </Typography>
          )}
        </Stack>
      </MainCard>
    </Box>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isLoss: PropTypes.bool,
  extra: PropTypes.string,
};
