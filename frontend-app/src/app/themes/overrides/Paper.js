// ==============================|| OVERRIDES - PAPER ||============================== //

export default function Paper(theme) {
    return {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 'none',
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                }
            }
        }
    };
}
