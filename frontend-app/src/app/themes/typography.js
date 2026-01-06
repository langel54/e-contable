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
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.625rem',
      lineHeight: 1.3
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5
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
