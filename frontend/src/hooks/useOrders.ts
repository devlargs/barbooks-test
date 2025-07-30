import { useState, useEffect } from "react";

interface Order {
  id: number;
  product: string;
  qty: number;
  price: number;
}

interface OrdersResponse {
  orders: Order[];
  totalCount: number;
  limit?: number;
  offset?: number;
}

interface UseOrdersReturn {
  data: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  totalCount: number;
}

interface UseOrdersParams {
  limit?: number;
  offset?: number;
  product?: string;
}

export function useOrders(params: UseOrdersParams = {}): UseOrdersReturn {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.offset)
        searchParams.append("offset", params.offset.toString());
      if (params.product) searchParams.append("product", params.product);

      const url = `http://localhost:3000/api/orders${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: OrdersResponse = await response.json();
      setData(responseData.orders);
      setTotalCount(responseData.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [params.limit, params.offset, params.product]);

  return {
    data,
    loading,
    error,
    refetch: fetchOrders,
    totalCount,
  };
}
