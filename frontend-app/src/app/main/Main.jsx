"use client";
import { Tabs, Tab, Box, Typography, Stack, Divider } from "@mui/material";
import { useState } from "react";
import ClientsDashboardPage from "./clients-dashboard/ClientsDashboardPage";
import CashDashboardPage from "./caja-dashboard/CashDashboardPage";
import TributosDashboardPage from "./tributos-dashboard/TributosDashboardPage";

export default function Main() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Stack direction="row" justifyContent="center">
        <Typography variant="h5" fontWeight="bold">
          Dashboard Principal
        </Typography>
      </Stack>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} centered size="small">
        <Tab label="Clientes" />
        <Tab label="Caja" />
        <Tab label="Tributos" />
      </Tabs>
      {/* <Divider variant="fullWidth" sx={{ mt: 2 }} /> */}
      <Box sx={{ p: 2 }}>
        {tab === 0 && <ClientsDashboardPage />}
        {tab === 1 && <CashDashboardPage />}
        {tab === 2 && <TributosDashboardPage />}
      </Box>
    </Box>
  );
}
