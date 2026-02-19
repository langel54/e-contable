// ==============================|| OVERRIDES - PAPER ||============================== //

export default function Paper(theme) {
    return {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove elevation overlay in dark mode
                }
            }
        }
    };
}
