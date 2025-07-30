import React, { useState, useEffect, useCallback } from "react";
import { useSummary } from "../hooks/useSummary";
import { useOrders } from "../hooks/useOrders";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { useDeleteOrder } from "../hooks/useDeleteOrder";
import { useOrderForm } from "../hooks/useOrderForm";
import {
  StatCard,
  SearchInput,
  FormInput,
  Pagination,
  DeleteModal,
} from "./ui";
import { formatCurrency, formatNumber } from "../utils/formatters";
import { ITEMS_PER_PAGE } from "../constants";

interface Order {
  id: number;
  product: string;
  qty: number;
  price: number;
}

const LoadingSpinner: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => <div className="text-center text-sm text-gray-500">{text}</div>;

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center text-sm text-red-500">{message}</div>
);

const OrdersDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<{
    id: number;
    product: string;
  } | null>(null);

  const orderForm = useOrderForm();

  const {
    data: summary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useSummary();
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
    totalCount,
  } = useOrders({
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    product: searchTerm || undefined,
  });
  const {
    createOrder,
    loading: createLoading,
    error: createError,
  } = useCreateOrder();
  const {
    deleteOrder,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteOrder();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleAddOrder = useCallback(async () => {
    if (!orderForm.validate()) return;

    const orderData = orderForm.getOrderData();
    const result = await createOrder(orderData);

    if (result) {
      orderForm.reset();
      setCurrentPage(1);
      refetchSummary();
      refetchOrders();
    }
  }, [orderForm, createOrder, refetchSummary, refetchOrders]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleDeleteClick = useCallback((order: Order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!orderToDelete) return;

    const success = await deleteOrder(orderToDelete.id);
    if (success) {
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      refetchSummary();
      refetchOrders();
    }
  }, [orderToDelete, deleteOrder, refetchSummary, refetchOrders]);

  const handleCancelDelete = useCallback(() => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  }, []);

  const renderOrdersTable = () => {
    if (ordersLoading) return <LoadingSpinner text="Loading orders..." />;
    if (ordersError) return <ErrorMessage message="Error loading orders" />;
    if (orders.length === 0)
      return (
        <div className="text-center text-sm text-gray-500">No orders found</div>
      );

    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.product}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatNumber(order.qty)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(order.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(order.qty * order.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => handleDeleteClick(order)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete order"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Orders Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={
              summary?.totalRevenue ? formatCurrency(summary.totalRevenue) : "0"
            }
            subtitle="From all orders"
            icon="$"
            loading={summaryLoading}
            error={summaryError}
          />
          <StatCard
            title="Median Order Price"
            value={
              summary?.medianOrderPrice
                ? formatCurrency(summary.medianOrderPrice)
                : "0.00"
            }
            subtitle="Middle order value"
            icon="📈"
            loading={summaryLoading}
            error={summaryError}
          />
          <StatCard
            title="Top Product by Quantity"
            value={summary?.topProductByQty || "No products"}
            subtitle="Most ordered item"
            icon="📦"
            loading={summaryLoading}
            error={summaryError}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Orders</h2>
                {ordersLoading ? (
                  <p className="text-sm text-gray-500">Loading orders...</p>
                ) : ordersError ? (
                  <p className="text-sm text-red-500">Error loading orders</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {totalCount} total orders
                  </p>
                )}
              </div>

              <div className="p-6 border-b border-gray-200">
                <SearchInput
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by product name..."
                />
              </div>

              <div className="overflow-x-auto">{renderOrdersTable()}</div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>

          {/* Add Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Order
                </h2>
                <p className="text-sm text-gray-500">
                  Create a new order entry
                </p>
              </div>

              <div className="p-6 space-y-4">
                <FormInput
                  label="Product Name"
                  type="text"
                  value={orderForm.form.product}
                  onChange={(value) => orderForm.updateField("product", value)}
                  error={orderForm.errors.product}
                  placeholder="Enter product name"
                />

                <FormInput
                  label="Quantity"
                  type="number"
                  value={orderForm.form.qty}
                  onChange={(value) => orderForm.updateField("qty", value)}
                  error={orderForm.errors.qty}
                  placeholder="Enter quantity"
                />

                <FormInput
                  label="Price per Unit"
                  type="number"
                  value={orderForm.form.price}
                  onChange={(value) => orderForm.updateField("price", value)}
                  error={orderForm.errors.price}
                  placeholder="Enter price"
                  step="0.01"
                />

                {createError && (
                  <div className="text-red-500 text-sm mb-4">{createError}</div>
                )}

                <button
                  onClick={handleAddOrder}
                  disabled={createLoading}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {createLoading ? "Adding..." : "Add Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        order={orderToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
};

export default OrdersDashboard;
