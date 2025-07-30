import { summarizeOrders } from "../summarizeOrders";
import { Order } from "../../types";

describe("summarizeOrders", () => {
  test("should handle typical case with diverse orders", () => {
    const orders: Order[] = [
      { id: 1, product: "Laptop", qty: 2, price: 1000 },
      { id: 2, product: "Mouse", qty: 5, price: 25 },
      { id: 3, product: "Keyboard", qty: 3, price: 50 },
      { id: 4, product: "Laptop", qty: 1, price: 1000 },
      { id: 5, product: "Monitor", qty: 2, price: 300 },
    ];

    const result = summarizeOrders(orders);

    expect(result.totalRevenue).toBe(
      2 * 1000 + 5 * 25 + 3 * 50 + 1 * 1000 + 2 * 300
    ); // 3625
    expect(result.medianOrderPrice).toBe(600); // [50, 125, 300, 600, 2000] -> median is 600
    expect(result.topProductByQty).toBe("Mouse"); // Laptop: 3 total qty, Mouse: 5 total qty
    expect(result.uniqueProductCount).toBe(4); // Laptop, Mouse, Keyboard, Monitor
  });

  test("should handle edge case with empty array", () => {
    const orders: Order[] = [];

    const result = summarizeOrders(orders);

    expect(result.totalRevenue).toBe(0);
    expect(result.medianOrderPrice).toBe(0);
    expect(result.topProductByQty).toBe("");
    expect(result.uniqueProductCount).toBe(0);
  });

  test("should handle edge case with same product multiple times", () => {
    const orders: Order[] = [
      { id: 1, product: "Book", qty: 2, price: 10 },
      { id: 2, product: "Book", qty: 3, price: 10 },
      { id: 3, product: "Book", qty: 1, price: 10 },
    ];

    const result = summarizeOrders(orders);

    expect(result.totalRevenue).toBe(6 * 10); // 60
    expect(result.medianOrderPrice).toBe(20); // [10, 20, 30] -> median is 20
    expect(result.topProductByQty).toBe("Book"); // Only one product
    expect(result.uniqueProductCount).toBe(1); // Only one unique product
  });

  test("should handle edge case with single order", () => {
    const orders: Order[] = [
      { id: 1, product: "Single Item", qty: 1, price: 100 },
    ];

    const result = summarizeOrders(orders);

    expect(result.totalRevenue).toBe(100);
    expect(result.medianOrderPrice).toBe(100);
    expect(result.topProductByQty).toBe("Single Item");
    expect(result.uniqueProductCount).toBe(1);
  });

  test("should handle edge case with even number of orders for median calculation", () => {
    const orders: Order[] = [
      { id: 1, product: "A", qty: 1, price: 10 },
      { id: 2, product: "B", qty: 1, price: 20 },
      { id: 3, product: "C", qty: 1, price: 30 },
      { id: 4, product: "D", qty: 1, price: 40 },
    ];

    const result = summarizeOrders(orders);

    expect(result.medianOrderPrice).toBe(25); // [10, 20, 30, 40] -> median is (20+30)/2 = 25
  });
});
