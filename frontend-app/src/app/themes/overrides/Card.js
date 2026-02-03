// ==============================|| OVERRIDES - CARD ||============================== //

export default function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16, // Modern rounded corners
                    backgroundImage: 'none', // Remove default gradient in dark mode
                    color: theme.palette.text.primary,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                        : undefined,
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
                            : undefined,
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
