import { Router, Request, Response } from "express";
import { OrderService } from "../services/orderService";
import { summarizeOrders } from "../utils/summarizeOrders";

const router = Router();

router.get("/summary", async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrders();
    const summary = summarizeOrders(orders);

    res.json(summary);
  } catch (error) {
    console.error("Error getting summary:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve order summary",
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { product, limit, offset } = req.query;

    const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
    const parsedOffset = offset ? parseInt(offset as string, 10) : undefined;

    if (parsedLimit !== undefined && (isNaN(parsedLimit) || parsedLimit < 0)) {
      return res.status(400).json({
        error: "Invalid limit parameter",
        message: "Limit must be a positive number",
      });
    }

    if (
      parsedOffset !== undefined &&
      (isNaN(parsedOffset) || parsedOffset < 0)
    ) {
      return res.status(400).json({
        error: "Invalid offset parameter",
        message: "Offset must be a positive number",
      });
    }

    const [orders, totalCount] = await Promise.all([
      OrderService.getOrdersWithFilters(
        product as string,
        parsedLimit,
        parsedOffset
      ),
      OrderService.getOrdersCount(product as string),
    ]);

    res.json({
      orders,
      totalCount,
      limit: parsedLimit,
      offset: parsedOffset,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve orders",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    const validation = await OrderService.validateOrderData(orderData);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid order data",
        details: validation.errors,
      });
    }

    const newOrder = await OrderService.createOrder({
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

export default router;
