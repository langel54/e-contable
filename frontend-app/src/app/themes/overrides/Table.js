// ==============================|| OVERRIDES - TABLE ||============================== //

export default function Table(theme) {
    return {
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    borderRadius: 8,
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.grey[50],
                    '& .MuiTableCell-root': {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        lineHeight: '1.5rem',
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                        color: theme.palette.text.secondary
                    }
                }
            }
        },
        MuiTableBody: {
            styleOverrides: {
                root: {
                    '& .MuiTableRow-root:last-of-type .MuiTableCell-root': {
                        borderBottom: 'none'
                    },
                    '& .MuiTableRow-root:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.primary.lighter
                            : theme.palette.action.hover
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    padding: 16,
                    // Match text color for premium feel
                    color: theme.palette.text.primary
                },
                head: {
                    color: theme.palette.text.secondary,
                    backgroundColor: 'inherit'
                }
            }
        }
    };
}
