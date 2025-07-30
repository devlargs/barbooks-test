import { Request, Response, NextFunction } from "express";
import cors from "cors";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
};

export const corsMiddleware = cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
});
