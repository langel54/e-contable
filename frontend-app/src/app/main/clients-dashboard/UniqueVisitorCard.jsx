"use client";

// material-ui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// project import
import MainCard from "../../ui-components/MainCard";
import IncomeAreaChart from "./IncomeAreaChart";

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard({ seriesData, categories, colors }) {
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Clientes por Régimen</Typography>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart seriesData={seriesData} categories={categories} colors={colors} />
        </Box>
      </MainCard>
    </>
  );
}
