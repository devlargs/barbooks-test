import { db } from "../database/db";
import { Order } from "../types";

export class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM orders ORDER BY id", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Order[]);
        }
      });
    });
  }

  static async getOrdersWithFilters(
    product?: string,
    limit?: number,
    offset?: number
  ): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM orders WHERE 1=1";
      const params: any[] = [];

      if (product) {
        sql += " AND product LIKE ?";
        params.push(`%${product}%`);
      }

      sql += " ORDER BY id";

      if (limit) {
        sql += " LIMIT ?";
        params.push(limit);
      }

      if (offset) {
        sql += " OFFSET ?";
        params.push(offset);
      }

      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Order[]);
        }
      });
    });
  }

  static async getOrdersCount(product?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT COUNT(*) as count FROM orders WHERE 1=1";
      const params: any[] = [];

      if (product) {
        sql += " AND product LIKE ?";
        params.push(`%${product}%`);
      }

      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve((row as any).count);
        }
      });
    });
  }

  static async createOrder(orderData: Omit<Order, "id">): Promise<Order> {
    return new Promise((resolve, reject) => {
      const { product, qty, price } = orderData;

      db.run(
        "INSERT INTO orders (product, qty, price) VALUES (?, ?, ?)",
        [product, qty, price],
        function (err) {
          if (err) {
            reject(err);
          } else {
            const newOrder: Order = {
              id: this.lastID,
              product,
              qty,
              price,
            };
            resolve(newOrder);
          }
        }
      );
    });
  }

  static async validateOrderData(
    orderData: any
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (
      !orderData.product ||
      typeof orderData.product !== "string" ||
      orderData.product.trim() === ""
    ) {
      errors.push("Product is required and must be a non-empty string");
    }

    if (
      !orderData.qty ||
      typeof orderData.qty !== "number" ||
      orderData.qty <= 0
    ) {
      errors.push("Quantity is required and must be a positive number");
    }

    if (
      !orderData.price ||
      typeof orderData.price !== "number" ||
      orderData.price <= 0
    ) {
      errors.push("Price is required and must be a positive number");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
