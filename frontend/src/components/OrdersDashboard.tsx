import React, { useState, useEffect } from "react";
import { useSummary } from "../hooks/useSummary";
import { useOrders } from "../hooks/useOrders";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { useDeleteOrder } from "../hooks/useDeleteOrder";

const OrdersDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newOrder, setNewOrder] = useState({
    product: "",
    qty: "",
    price: "",
  });
  const [formErrors, setFormErrors] = useState({
    product: "",
    qty: "",
    price: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<{
    id: number;
    product: string;
  } | null>(null);

  const ITEMS_PER_PAGE = 5;

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

  const validateForm = () => {
    const errors = {
      product: "",
      qty: "",
      price: "",
    };
    let isValid = true;

    if (!newOrder.product.trim()) {
      errors.product = "Product name is required";
      isValid = false;
    } else if (newOrder.product.trim().length < 2) {
      errors.product = "Product name must be at least 2 characters";
      isValid = false;
    }

    if (!newOrder.qty) {
      errors.qty = "Quantity is required";
      isValid = false;
    } else {
      const qty = parseInt(newOrder.qty);
      if (isNaN(qty) || qty <= 0) {
        errors.qty = "Quantity must be a positive number";
        isValid = false;
      }
    }

    if (!newOrder.price) {
      errors.price = "Price is required";
      isValid = false;
    } else {
      const price = parseFloat(newOrder.price);
      if (isNaN(price) || price <= 0) {
        errors.price = "Price must be a positive number";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddOrder = async () => {
    if (!validateForm()) {
      return;
    }

    const orderData = {
      product: newOrder.product.trim(),
      qty: parseInt(newOrder.qty),
      price: parseFloat(newOrder.price),
    };

    const result = await createOrder(orderData);
    if (result) {
      setNewOrder({ product: "", qty: "", price: "" });
      setFormErrors({ product: "", qty: "", price: "" });
      setCurrentPage(1);
      refetchSummary();
      refetchOrders();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (order: { id: number; product: string }) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    const success = await deleteOrder(orderToDelete.id);
    if (success) {
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      refetchSummary();
      refetchOrders();
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
      >
        Previous
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 text-sm rounded ${
            currentPage === i
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
      >
        Next
      </button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Orders Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                {summaryLoading ? (
                  <p className="text-3xl font-bold text-gray-900">Loading...</p>
                ) : summaryError ? (
                  <p className="text-3xl font-bold text-red-600">Error</p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    ${summary?.totalRevenue.toLocaleString() || "0"}
                  </p>
                )}
                <p className="text-sm text-gray-500">From all orders</p>
              </div>
              <div className="text-2xl text-gray-400">$</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Median Order Price
                </p>
                {summaryLoading ? (
                  <p className="text-3xl font-bold text-gray-900">Loading...</p>
                ) : summaryError ? (
                  <p className="text-3xl font-bold text-red-600">Error</p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    ${summary?.medianOrderPrice.toFixed(2) || "0.00"}
                  </p>
                )}
                <p className="text-sm text-gray-500">Middle order value</p>
              </div>
              <div className="text-2xl text-gray-400">📈</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Top Product by Quantity
                </p>
                {summaryLoading ? (
                  <p className="text-3xl font-bold text-gray-900">Loading...</p>
                ) : summaryError ? (
                  <p className="text-3xl font-bold text-red-600">Error</p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {summary?.topProductByQty || "No products"}
                  </p>
                )}
                <p className="text-sm text-gray-500">Most ordered item</p>
              </div>
              <div className="text-2xl text-gray-400">📦</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
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
                    {ordersLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          Loading orders...
                        </td>
                      </tr>
                    ) : ordersError ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-sm text-red-500"
                        >
                          Error loading orders
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.product}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.qty.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${(order.qty * order.price).toFixed(2)}
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  {renderPaginationButtons()}
                </div>
              </div>
            </div>
          </div>

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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={newOrder.product}
                    onChange={(e) => {
                      setNewOrder({ ...newOrder, product: e.target.value });
                      if (formErrors.product) {
                        setFormErrors({ ...formErrors, product: "" });
                      }
                    }}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 ${
                      formErrors.product ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.product && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.product}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={newOrder.qty}
                    onChange={(e) => {
                      setNewOrder({ ...newOrder, qty: e.target.value });
                      if (formErrors.qty) {
                        setFormErrors({ ...formErrors, qty: "" });
                      }
                    }}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 ${
                      formErrors.qty ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.qty && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.qty}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Unit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={newOrder.price}
                    onChange={(e) => {
                      setNewOrder({ ...newOrder, price: e.target.value });
                      if (formErrors.price) {
                        setFormErrors({ ...formErrors, price: "" });
                      }
                    }}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 ${
                      formErrors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.price}
                    </p>
                  )}
                </div>

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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Order
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the order for{" "}
                <span className="font-medium text-gray-900">
                  "{orderToDelete?.product}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            {deleteError && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {deleteError}
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersDashboard;
