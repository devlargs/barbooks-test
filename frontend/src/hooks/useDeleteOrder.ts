import { useState } from "react";

interface UseDeleteOrderReturn {
  deleteOrder: (orderId: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteOrder(): UseDeleteOrderReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteOrder = async (orderId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:3000/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteOrder,
    loading,
    error,
  };
}
