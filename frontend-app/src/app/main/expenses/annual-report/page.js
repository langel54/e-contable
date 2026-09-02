"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Skeleton,
    LinearProgress
} from "@mui/material";
import PageLayout from "@/app/ui-components/layout/PageLayout";
import MainCard from "@/app/ui-components/MainCard";
import FilterToolbar, { FilterField } from "@/app/ui-components/layout/FilterToolbar";
import { FILTER_LAYOUT, VIEW_LAYOUT } from "@/app/ui-components/layout/layoutConstants";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import YearPickerField from "@/app/components/YearPickerField";
import { getAnnualExpenseReport } from "@/app/services/egresosClienteService"; // Imported new service
import { saveAs } from "file-saver";

const AnnualExpenseReportPage = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalAnnual, setTotalAnnual] = useState(0);

    const fetchData = async (year) => {
        setLoading(true);
        try {
            const data = await getAnnualExpenseReport(year);
            // Sort by Razon Social
            data.sort((a, b) => a.razon_social.localeCompare(b.razon_social));
            setReportData(data);

            // Calculate total for the year
            const total = data.reduce((acc, curr) => acc + (curr.anual || 0), 0);
            setTotalAnnual(total);
        } catch (error) {
            console.error("Error fetching annual expense report:", error);
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

        // Dynamic import for exceljs
        const XLSX = await import("exceljs");
        const workbook = new XLSX.Workbook();
        const worksheet = workbook.addWorksheet(`Reporte Egresos ${selectedYear}`);

        // Headers
        const headers = [
            "ID", "Razon Social", "Cant. de Pagos",
            "ENE", "FEB", "MAR", "ABRIL", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC", "ANUAL"
        ];

        // Add header row with style (Red/Orange for Expenses)
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD32F2F' } // Red 700
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
                    const cell = newRow.getCell(index + 4);
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFCDD2' } // Red 100
                    };
                    cell.font = { color: { argb: 'FFB71C1C' }, bold: true }; // Red 900
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `Reporte_Egresos_Anual_${selectedYear}.xlsx`);
    };

    // Cell style helper adapted for Expenses
    const getCellStyle = (value) => {
        if (value > 0) {
            return {
                backgroundColor: "error.lighter",
                color: "error.dark",
                textAlign: "center",
                fontWeight: "bold",
                borderRight: "1px solid",
                borderColor: "divider",
                height: '40px'
            };
        }
        return {
            textAlign: "center",
            borderRight: "1px solid",
            borderColor: 'divider',
            color: 'text.disabled'
        };
    };

    const months = ["ENE", "FEB", "MAR", "ABRIL", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
    const monthKeys = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];

    // Formatter for currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    return (
        <PageLayout
            title="Reporte anual de egresos"
            subtitle="Vista general de egresos por cliente mensualizados"
        >
            <MainCard contentSX={FILTER_LAYOUT.cardContent}>
                <FilterToolbar>
                    <FilterField>
                        <Card elevation={0} variant="outlined" sx={{ borderRadius: 1.5 }}>
                            <CardContent sx={{ py: 1, px: 2, "&:last-child": { pb: 1 } }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                    Clientes
                                </Typography>
                                <Typography variant="h6" fontWeight={800}>
                                    {loading ? "…" : reportData.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </FilterField>
                    <FilterField>
                        <Card elevation={0} variant="outlined" sx={{ borderRadius: 1.5, bgcolor: "error.lighter", borderColor: "error.light" }}>
                            <CardContent sx={{ py: 1, px: 2, "&:last-child": { pb: 1 } }}>
                                <Typography variant="caption" color="error.dark" fontWeight={700}>
                                    Total egresos
                                </Typography>
                                <Typography variant="h6" color="error.main" fontWeight={800}>
                                    {loading ? "…" : formatCurrency(totalAnnual)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </FilterField>
                    <FilterField>
                        <YearPickerField
                            selected={selectedYear}
                            onChange={handleYearChange}
                        />
                    </FilterField>
                    <FilterField>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleExportExcel}
                            disabled={loading || reportData.length === 0}
                        >
                            Exportar
                        </Button>
                    </FilterField>
                </FilterToolbar>
            </MainCard>

            <MainCard
                content={false}
                sx={{ mt: VIEW_LAYOUT.sectionGap, overflow: "hidden", position: "relative" }}
            >
                {loading && (
                    <LinearProgress
                        color="error"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 2,
                            height: 3
                        }}
                    />
                )}
                <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: 'error.main', color: (theme) => theme.palette.error.contrastText, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5, borderBottom: 'none' }}>ID</TableCell>
                                <TableCell sx={{ backgroundColor: 'error.main', color: (theme) => theme.palette.error.contrastText, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5, minWidth: 200, borderBottom: 'none' }}>Razon Social</TableCell>
                                <TableCell sx={{ backgroundColor: 'error.main', color: (theme) => theme.palette.error.contrastText, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5, whiteSpace: 'nowrap', textAlign: 'center', borderBottom: 'none' }}>Cant. Pagos</TableCell>
                                {months.map((m) => (
                                    <TableCell key={m} sx={{ backgroundColor: 'error.main', color: (theme) => theme.palette.error.contrastText, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5, textAlign: 'center', minWidth: 60, borderBottom: 'none' }}>
                                        {m}
                                    </TableCell>
                                ))}
                                <TableCell sx={{ backgroundColor: 'error.main', color: (theme) => theme.palette.error.contrastText, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5, textAlign: 'center', minWidth: 100, borderBottom: 'none' }}>TOTAL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                // Skeleton Loading Rows
                                Array.from(new Array(10)).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ p: 1.5 }}><Skeleton variant="text" width={20} /></TableCell>
                                        <TableCell sx={{ p: 1.5 }}><Skeleton variant="text" width="80%" /></TableCell>
                                        <TableCell sx={{ p: 1.5 }}><Skeleton variant="text" width={30} sx={{ mx: 'auto' }} /></TableCell>
                                        {monthKeys.map((k) => (
                                            <TableCell key={k} sx={{ p: 1.5 }}><Skeleton variant="rectangular" height={24} width="100%" /></TableCell>
                                        ))}
                                        <TableCell sx={{ p: 1.5 }}><Skeleton variant="text" width={40} sx={{ mx: 'auto' }} /></TableCell>
                                    </TableRow>
                                ))
                            ) : reportData.length > 0 ? (
                                reportData.map((row) => (
                                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: '500', color: 'text.secondary', fontSize: '0.8rem' }}>{row.id}</TableCell>
                                        <TableCell sx={{ fontWeight: '600', color: 'text.primary' }}>{row.razon_social}</TableCell>
                                        <TableCell align="center" sx={{ color: 'text.secondary' }}>{row.cant_pagos}</TableCell>
                                        {monthKeys.map((key) => (
                                            <TableCell key={key} sx={getCellStyle(row[key])}>
                                                {row[key] > 0 ? row[key] : '-'}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center" sx={{ fontWeight: '800', backgroundColor: 'background.paper', color: 'error.main', borderLeft: '1px solid', borderColor: 'divider' }}>
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
            </MainCard>
        </PageLayout>
    );
};

export default AnnualExpenseReportPage;
