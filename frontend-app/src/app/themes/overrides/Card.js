import { alpha } from '@mui/material/styles';

// ==============================|| OVERRIDES - CARD ||============================== //

export default function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: theme.shape.borderRadius,
                    backgroundImage: 'none',
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.5 : 1)}`,
                    boxShadow: theme.app?.surface?.cardGlow || theme.customShadows?.z1,
                    transition: 'border-color 0.2s ease',
                }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 24,
                    '&:last-child': {
                        paddingBottom: 24
                    }
                }
            }
        }
    };
}
