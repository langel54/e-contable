// ==============================|| OVERRIDES - TOOLTIP ||============================== //

export default function Tooltip(theme) {
    return {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: theme.palette.grey[700],
                    color: theme.palette.background.paper,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    boxShadow: theme.shadows[1]
                },
                arrow: {
                    color: theme.palette.grey[700]
                }
            }
        }
    };
}
