import { db } from "./db";

const sampleOrders = [
  { product: "Laptop", qty: 2, price: 1200.0 },
  { product: "Mouse", qty: 10, price: 25.5 },
  { product: "Keyboard", qty: 5, price: 75.0 },
  { product: "Monitor", qty: 3, price: 350.0 },
  { product: "Headphones", qty: 8, price: 45.0 },
  { product: "Webcam", qty: 4, price: 120.0 },
  { product: "Laptop", qty: 1, price: 1200.0 },
  { product: "Mouse", qty: 15, price: 25.5 },
];

async function seedDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM orders", (err) => {
      if (err) {
        console.error("Error clearing orders:", err.message);
        reject(err);
        return;
      }

      console.log("Cleared existing orders");

      const insertSQL =
        "INSERT INTO orders (product, qty, price) VALUES (?, ?, ?)";
      let completed = 0;

      sampleOrders.forEach((order) => {
        db.run(
          insertSQL,
          [order.product, order.qty, order.price],
          function (err) {
            if (err) {
              console.error("Error inserting order:", err.message);
              reject(err);
              return;
            }

            completed++;
            console.log(
              `Inserted order ${completed}: ${order.product} x${order.qty} @ $${order.price}`
            );

            if (completed === sampleOrders.length) {
              console.log("Database seeded successfully!");
              resolve();
            }
          }
        );
      });
    });
  });
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
