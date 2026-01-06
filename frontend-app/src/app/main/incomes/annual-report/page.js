"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Paper,
    Divider,
    GlobalStyles,
} from "@mui/material";
import { Search as SearchIcon, FileDownload as FileDownloadIcon } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAnnualReport } from "@/app/services/incomesServices";
import dayjs from "dayjs";
import * as XLSX from "exceljs";
import { saveAs } from "file-saver";

const AnnualReportPage = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [reportData, setReportData] = useState([]); // All data fetched from API
    const [loading, setLoading] = useState(false);
    const [totalAnnual, setTotalAnnual] = useState(0);

    const fetchData = async (year) => {
        setLoading(true);
        try {
            const data = await getAnnualReport(year);
            // Sort by Razon Social
            data.sort((a, b) => a.razon_social.localeCompare(b.razon_social));
            setReportData(data);

            // Calculate total for the year
            const total = data.reduce((acc, curr) => acc + (curr.anual || 0), 0);
            setTotalAnnual(total);
        } catch (error) {
            console.error("Error fetching annual report:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-load on mount and when year changes
    useEffect(() => {
        fetchData(selectedYear);
    }, [selectedYear]);

    const handleYearChange = (date) => {
        if (date) {
            setSelectedYear(date.getFullYear());
        }
    };

    const handleExportExcel = async () => {
        if (!reportData.length) return;

        const workbook = new XLSX.Workbook();
        const worksheet = workbook.addWorksheet(`Reporte ${selectedYear}`);

        // Headers
        const headers = [
            "ID", "Razon Social", "Cant. de Pagos",
            "ENE", "FEB", "MAR", "ABRIL", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC", "ANUAL"
        ];

        // Add header row with style
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1976D2' }
        };

        // Data
        reportData.forEach(row => {
            const newRow = worksheet.addRow([
                row.id, row.razon_social, row.cant_pagos,
                row.ene, row.feb, row.mar, row.abr, row.may, row.jun,
                row.jul, row.ago, row.set, row.oct, row.nov, row.dic,
                row.anual
            ]);

            // Highlight cells with value
            monthKeys.forEach((key, index) => {
                if (row[key] > 0) {
                    // +4 because: ID, Razon, Cant are cols 1,2,3. So Ene is 4.
                    const cell = newRow.getCell(index + 4);
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF2E7D32' }
                    };
                    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `Reporte_Ingresos_Anual_${selectedYear}.xlsx`);
    };

    // Cell style helper
    const getCellStyle = (value) => {
        if (value > 0) {
            return {
                backgroundColor: "#2e7d32",
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                height: '40px'
            };
        }
        return {
            textAlign: "center",
            borderRight: "1px solid #e0e0e0",
            color: '#757575'
        };
    };

    const months = ["ENE", "FEB", "MAR", "ABRIL", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
    const monthKeys = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];

    // Formatter for currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            <GlobalStyles styles={{ '.react-datepicker-popper': { zIndex: '9999 !important' } }} />
            {/* Header Section */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#fff' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box>
                        <Typography variant="h5" fontWeight="700" color="primary.main">
                            Reporte Anual de Ingresos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Vista general de pagos por cliente mensualizados
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                        <Card elevation={0} sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: 2, minWidth: 120 }}>
                            <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                    CLIENTES
                                </Typography>
                                <Typography variant="h6" color="text.primary" fontWeight="800">
                                    {loading ? '...' : reportData.length}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card elevation={0} sx={{ bgcolor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 2, minWidth: 200, display: { xs: 'none', md: 'block' } }}>
                            <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" color="primary.dark" fontWeight="bold">
                                    TOTAL
                                </Typography>
                                <Typography variant="h6" color="primary.main" fontWeight="800">
                                    {loading ? '...' : formatCurrency(totalAnnual)}
                                </Typography>
                            </CardContent>
                        </Card>

                        <DatePicker
                            selected={new Date(selectedYear, 0, 1)}
                            onChange={handleYearChange}
                            showYearPicker
                            dateFormat="yyyy"
                            customInput={
                                <TextField
                                    size="small"
                                    label="Año"
                                    InputProps={{
                                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                                    }}
                                    sx={{ width: 120, bgcolor: 'white' }}
                                />
                            }
                        />

                        <Button
                            variant="outlined"
                            color="success"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleExportExcel}
                            disabled={loading || reportData.length === 0}
                            sx={{ height: 40 }}
                        >
                            Exportar
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* Table Section */}
            <Card elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold', minWidth: 200 }}>Razon Social</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'center' }}>Cant. Pagos</TableCell>
                                {months.map((m) => (
                                    <TableCell key={m} sx={{ backgroundColor: '#1565c0', color: 'white', textAlign: 'center', fontWeight: '600', minWidth: 60 }}>
                                        {m}
                                    </TableCell>
                                ))}
                                <TableCell sx={{ backgroundColor: '#0d47a1', color: 'white', textAlign: 'center', fontWeight: 'bold', minWidth: 100 }}>TOTAL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                // Skeleton Loading Rows
                                Array.from(new Array(5)).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell colSpan={16} sx={{ p: 1 }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <div style={{ width: '100%', height: 30, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : reportData.length > 0 ? (
                                reportData.map((row) => (
                                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: '500', color: 'text.secondary', fontSize: '0.8rem' }}>{row.id}</TableCell>
                                        <TableCell sx={{ fontWeight: '600', color: '#1e293b' }}>{row.razon_social}</TableCell>
                                        <TableCell align="center" sx={{ color: 'text.secondary' }}>{row.cant_pagos}</TableCell>
                                        {monthKeys.map((key) => (
                                            <TableCell key={key} sx={getCellStyle(row[key])}>
                                                {row[key] > 0 ? row[key] : '-'}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center" sx={{ fontWeight: '800', backgroundColor: '#f8fafc', color: 'primary.main' }}>
                                            {row.anual > 0 ? row.anual : 0}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={16} align="center" sx={{ py: 5 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No se encontraron registros para el año {selectedYear}.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default AnnualReportPage;
