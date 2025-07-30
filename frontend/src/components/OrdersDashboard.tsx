import React, { useState } from "react";

interface Order {
  id: number;
  product: string;
  qty: number;
  price: number;
  total: number;
}

const OrdersDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newOrder, setNewOrder] = useState({
    product: "",
    qty: "",
    price: "",
  });

  // mock data
  const orders: Order[] = [
    { id: 1, product: "Balanar", qty: 12312, price: 213.0, total: 2622456.0 },
    {
      id: 2,
      product: "Wireless Headphones",
      qty: 2,
      price: 99.99,
      total: 199.98,
    },
    { id: 3, product: "Smartphone Case", qty: 1, price: 24.99, total: 24.99 },
    { id: 4, product: "USB Cable", qty: 3, price: 12.99, total: 38.97 },
    {
      id: 5,
      product: "Wireless Headphones",
      qty: 1,
      price: 99.99,
      total: 99.99,
    },
  ];

  const filteredOrders = orders.filter((order) =>
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = () => {
    console.log("Adding new order:", newOrder);
    setNewOrder({ product: "", qty: "", price: "" });
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
                <p className="text-3xl font-bold text-gray-900">
                  $2,623,671.77
                </p>
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
                <p className="text-3xl font-bold text-gray-900">$89.99</p>
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
                <p className="text-3xl font-bold text-gray-900">Balanar</p>
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
                <p className="text-sm text-gray-500">13 total orders</p>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
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
                          ${order.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">Page 1 of 3</div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-900 text-white rounded">
                    1
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    2
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    3
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    Next
                  </button>
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
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, product: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={newOrder.qty}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, qty: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  />
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
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, price: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>

                <button
                  onClick={handleAddOrder}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Add Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDashboard;
