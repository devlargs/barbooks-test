import express, { Request, Response } from "express";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple hello world endpoint
app.get("/", (_: Request, res: Response) => {
  return res.send("hello world");
});

export default app;
