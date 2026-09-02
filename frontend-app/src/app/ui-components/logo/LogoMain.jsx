// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();
  
  return (
    <svg width="250" height="36" viewBox="0 0 250 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Industry-Standard Accounting Icon: Isometric Ledger Stack / Balanced Books */}
      
      {/* Top Layer / Ledger Cover */}
      <path d="M 18 4 L 32 11 L 18 18 L 4 11 Z" fill={theme.palette.primary.light} opacity="0.9" />
      
      {/* Middle Layer (Documents/Data) */}
      <path d="M 4 16 L 18 23 L 32 16 L 32 19 L 18 26 L 4 19 Z" fill={theme.palette.primary.main} />
      
      {/* Bottom Layer (Foundation/Archives) */}
      <path d="M 4 21 L 18 28 L 32 21 L 32 24 L 18 31 L 4 24 Z" fill={theme.palette.primary.dark} />

      {/* Verification Checkmark (Balanced Books/Accuracy) */}
      <path d="M 13 11 L 17 14 L 23 7" stroke={theme.palette.background.paper} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Elegant Typography */}
      <text 
        x="45" 
        y="23" 
        fontFamily="'Inter', 'Roboto', 'Segoe UI', sans-serif" 
        fontSize="18" 
        fontWeight="800" 
        letterSpacing="1" 
        fill={theme.palette.text.primary}
        style={{ textTransform: 'uppercase' }}
      >
        Gestión
      </text>

      <text 
        x="135" 
        y="23" 
        fontFamily="'Inter', 'Roboto', 'Segoe UI', sans-serif" 
        fontSize="18" 
        fontWeight="300" 
        letterSpacing="1.5" 
        fill={theme.palette.primary.main}
        style={{ textTransform: 'uppercase' }}
      >
        Integral
      </text>
    </svg>
  );
};

export default Logo;
