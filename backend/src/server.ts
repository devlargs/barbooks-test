import express, { Request, Response } from "express";
import { corsMiddleware, requestLogger } from "./middleware";
import ordersRouter from "./routes/orders";
import { initializeDatabase } from "./database/db";

const app = express();

app.use(corsMiddleware);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_: Request, res: Response) => {
  return res.json({
    message: "Barbooks API Server",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/orders", ordersRouter);

initializeDatabase().catch(console.error);

export default app;
