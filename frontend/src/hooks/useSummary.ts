import { useState, useEffect } from "react";

interface Summary {
  totalRevenue: number;
  medianOrderPrice: number;
  topProductByQty: string;
  uniqueProductCount: number;
}

interface UseSummaryReturn {
  data: Summary | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSummary(): UseSummaryReturn {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/orders/summary");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const summaryData = await response.json();
      setData(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchSummary,
  };
}
