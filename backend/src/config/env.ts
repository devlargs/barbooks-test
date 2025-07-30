import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  DB_PATH: process.env.DB_PATH || path.join(__dirname, "../../data.db"),
  PORT: parseInt(process.env.PORT || "3000", 10),
};
