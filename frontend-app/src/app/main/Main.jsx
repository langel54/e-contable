"use client";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/app/provider";
import { DASHBOARD_TABS } from "./dashboardTabsConfig";

export default function Main() {
  const { userType } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);

  const idTipo = userType != null ? Number(userType) : null;
  const visibleTabs = idTipo != null && !Number.isNaN(idTipo)
    ? DASHBOARD_TABS.filter((t) => t.ids.includes(idTipo))
    : [];

  const safeIndex = visibleTabs.length ? Math.min(tabIndex, visibleTabs.length - 1) : 0;
  const currentTab = visibleTabs[safeIndex];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
        Dashboard Principal
      </Typography>

      {visibleTabs.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" sx={{ p: 2 }}>
          {idTipo != null ? "No tienes vistas asignadas en el inicio." : "Cargando..."}
        </Typography>
      ) : (
        <>
          <Tabs value={safeIndex} onChange={(_, i) => setTabIndex(i)} centered size="small">
            {visibleTabs.map((t) => (
              <Tab key={t.id} label={t.label} />
            ))}
          </Tabs>
          <Box sx={{ p: 2 }}>
            {currentTab && (() => {
              const C = currentTab.component;
              return <C />;
            })()}
          </Box>
        </>
      )}
    </Box>
  );
}
