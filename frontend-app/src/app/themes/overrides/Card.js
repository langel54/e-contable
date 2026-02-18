// ==============================|| OVERRIDES - CARD ||============================== //

export default function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundImage: 'none',
                    color: theme.palette.text.primary,
                    boxShadow: theme.customShadows?.z1 ?? theme.shadows[1],
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: theme.customShadows?.z2 ?? theme.shadows[2],
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
