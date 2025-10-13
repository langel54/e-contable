import { useState, useCallback } from "react";
import { getIngresos } from "@/app/services/incomesServices";

export function useIncomesData() {
  const [incomesData, setIncomesData] = useState();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchDataIncomes = useCallback(
    async (
      page,
      pageSize,
      startDate,
      endDate,
      conceptFilter,
      periodo,
      selectedAnio,
      selectedEstado
    ) => {
      setLoading(true);
      try {
        const data = await getIngresos(
          page,
          pageSize,
          "",
          selectedEstado,
          startDate,
          endDate,
          conceptFilter,
          periodo,
          selectedAnio
        );
        setIncomesData(data.ingresos);
        setTotal(data.pagination.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    incomesData,
    setIncomesData,
    pagination,
    setPagination,
    total,
    loading,
    fetchDataIncomes,
  };
}
