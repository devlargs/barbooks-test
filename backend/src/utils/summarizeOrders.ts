import { Order, Summary } from "../types";

export function summarizeOrders(orders: Order[]): Summary {
  if (orders.length === 0) {
    return {
      totalRevenue: 0,
      medianOrderPrice: 0,
      topProductByQty: "",
      uniqueProductCount: 0,
    };
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.qty * order.price,
    0
  );

  const orderPrices = orders
    .map((order) => order.qty * order.price)
    .sort((a, b) => a - b);
  const mid = Math.floor(orderPrices.length / 2);
  const medianOrderPrice =
    orderPrices.length % 2 === 0
      ? (orderPrices[mid - 1] + orderPrices[mid]) / 2
      : orderPrices[mid];

  const productQuantities = orders.reduce((acc, order) => {
    acc[order.product] = (acc[order.product] || 0) + order.qty;
    return acc;
  }, {} as Record<string, number>);

  const topProductByQty = Object.entries(productQuantities).reduce(
    (max, [product, qty]) => (qty > max.qty ? { product, qty } : max),
    { product: "", qty: 0 }
  ).product;

  const uniqueProductCount = new Set(orders.map((order) => order.product)).size;

  return {
    totalRevenue,
    medianOrderPrice,
    topProductByQty,
    uniqueProductCount,
  };
}
