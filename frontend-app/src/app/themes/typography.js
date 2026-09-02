// ==============================|| DEFAULT THEME - TYPOGRAPHY ||============================== //

export default function Typography(fontFamily) {
  return {
    htmlFontSize: 16,
    fontFamily,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontWeight: 700,
      fontSize: '2.375rem',
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.0625rem',
      lineHeight: 1.45,
    },
    h6: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.02em'
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.01em'
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.01em'
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.57
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.66
    },
    overline: {
      lineHeight: 1.66,
      textTransform: 'uppercase',
      fontWeight: 600,
      fontSize: '0.65rem',
      letterSpacing: '0.1em'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  };
}
