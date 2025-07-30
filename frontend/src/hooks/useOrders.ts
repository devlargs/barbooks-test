import { useState, useEffect } from "react";

interface Order {
  id: number;
  product: string;
  qty: number;
  price: number;
}

interface UseOrdersReturn {
  data: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrders(): UseOrdersReturn {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/orders");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const ordersData = await response.json();
      setData(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchOrders,
  };
}
