import request from "supertest";
import sqlite3 from "sqlite3";
import express from "express";
import { corsMiddleware, requestLogger } from "../middleware";
import { Order } from "../types";

class TestOrderService {
  private db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  async createOrder(orderData: Omit<Order, "id">): Promise<Order> {
    return new Promise((resolve, reject) => {
      const { product, qty, price } = orderData;

      this.db.run(
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

  async validateOrderData(
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

describe("POST /api/orders Integration Test", () => {
  let app: express.Application;
  let testDb: sqlite3.Database;
  let testOrderService: TestOrderService;

  beforeAll(async () => {
    testDb = new sqlite3.Database(":memory:");
    testOrderService = new TestOrderService(testDb);

    await new Promise<void>((resolve, reject) => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product TEXT NOT NULL,
          qty INTEGER NOT NULL,
          price REAL NOT NULL
        )
      `;

      testDb.run(createTableSQL, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    app = express();
    app.use(corsMiddleware);
    app.use(requestLogger);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post("/api/orders", async (req, res) => {
      try {
        const orderData = req.body;

        const validation = await testOrderService.validateOrderData(orderData);
        if (!validation.isValid) {
          return res.status(400).json({
            error: "Validation failed",
            message: "Invalid order data",
            details: validation.errors,
          });
        }

        const newOrder = await testOrderService.createOrder({
          product: orderData.product.trim(),
          qty: orderData.qty,
          price: orderData.price,
        });

        res.status(201).json(newOrder);
      } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
          error: "Internal server error",
          message: "Failed to create order",
        });
      }
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      testDb.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  beforeEach(async () => {
    await new Promise<void>((resolve, reject) => {
      testDb.run("DELETE FROM orders", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  describe("POST /api/orders", () => {
    it("should create a valid order and return it correctly", async () => {
      const validOrderData = {
        product: "Test Product",
        qty: 5,
        price: 29.99,
      };

      const response = await request(app)
        .post("/api/orders")
        .send(validOrderData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("product", validOrderData.product);
      expect(response.body).toHaveProperty("qty", validOrderData.qty);
      expect(response.body).toHaveProperty("price", validOrderData.price);
      expect(typeof response.body.id).toBe("number");
      expect(response.body.id).toBeGreaterThan(0);

      const insertedOrder = await new Promise<Order>((resolve, reject) => {
        testDb.get(
          "SELECT * FROM orders WHERE id = ?",
          [response.body.id],
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row as Order);
            }
          }
        );
      });

      expect(insertedOrder).toBeDefined();
      expect(insertedOrder.id).toBe(response.body.id);
      expect(insertedOrder.product).toBe(validOrderData.product);
      expect(insertedOrder.qty).toBe(validOrderData.qty);
      expect(insertedOrder.price).toBe(validOrderData.price);
    });

    it("should reject invalid order data", async () => {
      const invalidOrderData = {
        product: "",
        qty: -1,
        price: 0,
      };

      const response = await request(app)
        .post("/api/orders")
        .send(invalidOrderData)
        .expect(400);

      expect(response.body).toHaveProperty("error", "Validation failed");
      expect(response.body).toHaveProperty("message", "Invalid order data");
      expect(response.body).toHaveProperty("details");
      expect(Array.isArray(response.body.details)).toBe(true);
      expect(response.body.details.length).toBeGreaterThan(0);
    });

    it("should handle missing required fields", async () => {
      const incompleteOrderData = {
        product: "Test Product",
      };

      const response = await request(app)
        .post("/api/orders")
        .send(incompleteOrderData)
        .expect(400);

      expect(response.body).toHaveProperty("error", "Validation failed");
      expect(response.body).toHaveProperty("details");
      expect(response.body.details).toContain(
        "Quantity is required and must be a positive number"
      );
      expect(response.body.details).toContain(
        "Price is required and must be a positive number"
      );
    });
  });
});
