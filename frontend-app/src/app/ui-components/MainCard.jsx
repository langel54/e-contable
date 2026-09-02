import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

function MainCard(
  {
    border = true,
    boxShadow,
    children,
    content = true,
    contentSX = {},
    darkTitle,
    elevation,
    secondary,
    shadow,
    sx = {},
    title,
    ...others
  },
  ref
) {
  const theme = useTheme();
  const useShadow = theme.palette.mode === 'dark' ? boxShadow ?? true : boxShadow ?? true;
  const cardGlow = theme.app?.surface?.cardGlow;

  return (
    <Card
      elevation={elevation || 0}
      ref={ref}
      {...others}
      sx={{
        border: border ? '1px solid' : 'none',
        borderRadius: 1.5,
        borderColor: alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 1),
        boxShadow: useShadow ? shadow || cardGlow || theme.customShadows.z1 : 'none',
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
        backgroundColor: theme.palette.background.paper,
        backgroundImage: 'none',
        ':hover': {
          boxShadow: useShadow ? shadow || theme.customShadows.z2 : 'none',
        },
        '& pre': {
          m: 0,
          p: '16px !important',
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.75rem'
        },
        ...sx
      }}
    >
      {!darkTitle && title && (
        <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }} title={title} action={secondary} />
      )}
      {darkTitle && title && (
        <CardHeader sx={headerSX} title={<Typography variant="h4" fontWeight={800}>{title}</Typography>} action={secondary} />
      )}
      {content && <CardContent sx={contentSX}>{children}</CardContent>}
      {!content && children}
    </Card>
  );
}

export default forwardRef(MainCard);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  elevation: PropTypes.number,
  secondary: PropTypes.any,
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
