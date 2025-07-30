import { useState } from "react";

interface CreateOrderData {
  product: string;
  qty: number;
  price: number;
}

interface Order {
  id: number;
  product: string;
  qty: number;
  price: number;
}

interface UseCreateOrderReturn {
  createOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateOrder(): UseCreateOrderReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (
    orderData: CreateOrderData
  ): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const newOrder = await response.json();
      return newOrder;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error,
  };
}
