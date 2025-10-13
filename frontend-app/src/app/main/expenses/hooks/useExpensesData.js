import { useCallback, useState } from "react";
import { getExpenses } from "@/app/services/expensesServices";

export const useExpensesData = () => {
  const [expensesData, setExpensesData] = useState();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchDataExpenses = useCallback(
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
        const data = await getExpenses(
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
        setExpensesData(data.salidas);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error("Error fetching egresos:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    expensesData,
    setExpensesData,
    pagination,
    setPagination,
    total,
    loading,
    fetchDataExpenses,
  };
};
