// material-ui
import { alpha } from '@mui/material/styles';

// ==============================|| DEFAULT THEME - CUSTOM SHADOWS ||============================== //

export default function CustomShadows(theme) {
  const { palette } = theme;
  const isDark = palette.mode === 'dark';
  const shadowColor = isDark ? palette.common.black : palette.grey[900];
  const shadowAlpha = isDark ? 0.3 : 0.08;
  const shadowAlphaStrong = isDark ? 0.4 : 0.12;

  const z1 = `0px 2px 8px ${alpha(shadowColor, shadowAlpha)}`;
  const z2 = `0px 4px 12px ${alpha(shadowColor, shadowAlphaStrong)}`;

  // Button shadows for getShadow (primary, error, etc.)
  const primaryMain = palette.primary.main;
  const primaryButton = `0 2px 4px ${alpha(primaryMain, 0.25)}`;
  const secondaryButton = palette.secondary?.main ? `0 2px 4px ${alpha(palette.secondary.main, 0.25)}` : z1;
  const errorButton = `0 2px 4px ${alpha(palette.error.main, 0.25)}`;
  const warningButton = `0 2px 4px ${alpha(palette.warning.main, 0.25)}`;
  const infoButton = `0 2px 4px ${alpha(palette.info.main, 0.25)}`;
  const successButton = `0 2px 4px ${alpha(palette.success.main, 0.25)}`;

  return {
    button: `0 2px #0000000b`,
    text: `0 -1px 0 rgb(0 0 0 / 12%)`,
    z1,
    z2,
    primary: z1,
    secondary: z1,
    error: z1,
    warning: z1,
    info: z1,
    success: z1,
    primaryButton,
    secondaryButton,
    errorButton,
    warningButton,
    infoButton,
    successButton,
  };
}
