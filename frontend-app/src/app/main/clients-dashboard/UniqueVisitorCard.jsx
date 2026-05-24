"use client";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MainCard from "../../ui-components/MainCard";
import SectionTitle from "@/app/ui-components/SectionTitle";
import IncomeAreaChart from "./IncomeAreaChart";

export default function UniqueVisitorCard({ seriesData, categories, colors }) {
  return (
    <>
      <SectionTitle>Clientes por régimen</SectionTitle>
      <MainCard content={false}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart seriesData={seriesData} categories={categories} colors={colors} />
        </Box>
      </MainCard>
    </>
  );
}
