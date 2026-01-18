// ==============================|| OVERRIDES - DATA GRID ||============================== //

export default function DataGrid(theme) {
    return {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: 'none', // Remove outer border for cleaner look
                    backgroundColor: theme.palette.background.paper, // Use card background
                    '& .MuiDataGrid-withBorderColor': {
                        borderColor: theme.palette.divider,
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderColor: theme.palette.divider,
                        backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: 0.5,
                        color: theme.palette.text.secondary,
                    },
                    '& .MuiDataGrid-row': {
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark'
                                ? theme.palette.primary.lighter
                                : theme.palette.action.hover,
                        }
                    },
                    '& .MuiDataGrid-cell': {
                        borderColor: theme.palette.divider,
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: `1px solid ${theme.palette.divider}`,
                    },
                    // Fix for interactions with IconButtons inside the grid
                    // Force specific colors to win over DataGrid's default grey
                    '& .MuiIconButton-colorInfo': {
                        color: `${theme.palette.info.main} !important`,
                    },
                    '& .MuiIconButton-colorSuccess': {
                        color: `${theme.palette.success.main} !important`,
                    },
                    '& .MuiIconButton-colorError': {
                        color: `${theme.palette.error.main} !important`,
                    },
                    '& .MuiIconButton-colorWarning': {
                        color: `${theme.palette.warning.main} !important`,
                    },
                }
            }
        }
    };
}
