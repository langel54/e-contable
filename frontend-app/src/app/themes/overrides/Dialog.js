// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog(theme) {
    return {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    backgroundImage: 'none',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                        : undefined
                },
                container: {
                    backdropFilter: 'blur(3px)' // Modern glass morphism effect for backdrop
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    padding: '24px 24px 16px',
                }
            }
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: '0 24px 24px',
                }
            }
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: 24,
                    '& > :not(:first-of-type)': {
                        marginLeft: 16,
                    }
                }
            }
        }
    };
}
