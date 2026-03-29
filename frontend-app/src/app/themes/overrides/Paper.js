// ==============================|| OVERRIDES - PAPER ||============================== //

export default function Paper(theme) {
    return {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove elevation overlay in dark mode
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.customShadows.z1,
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                }
            }
        }
    };
}
