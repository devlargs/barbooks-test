import sqlite3 from "sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "../../data.db");

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product TEXT NOT NULL,
        qty INTEGER NOT NULL,
        price REAL NOT NULL
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
        reject(err);
      } else {
        console.log("Orders table created or already exists");
        resolve();
      }
    });
  });
}

export function closeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err.message);
        reject(err);
      } else {
        console.log("Database connection closed");
        resolve();
      }
    });
  });
}
