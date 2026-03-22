import { alpha } from '@mui/material/styles';

// ==============================|| OVERRIDES - CARD ||============================== //

export default function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundImage: 'none',
                    color: theme.palette.text.primary,
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    boxShadow: theme.customShadows?.z1 ?? `0 4px 24px 0 ${alpha('#000', 0.04)}`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customShadows?.z2 ?? `0 12px 32px -4px ${alpha('#000', 0.08)}`,
                    }
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
