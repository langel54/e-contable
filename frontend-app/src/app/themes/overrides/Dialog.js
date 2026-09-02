// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog(theme) {
    return {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    backgroundImage: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.app?.surface?.cardGlow || theme.customShadows?.z2,
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
