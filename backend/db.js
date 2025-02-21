// const { Pool } = require("pg");

// let pool;

// const createPool = (port) => {
//   return new Pool({
//     user: process.env.DB_USER || "postgres",
//     host: process.env.DB_HOST || "localhost",
//     database: process.env.DB_NAME || "ecommerce",
//     password: process.env.DB_PASS || "123456",
//     port: port,
//   });
// };

// // Try connecting to port 5433 first, then fallback to 5432 if it fails
// (async () => {
//   try {
//     pool = createPool(5433);
//     await pool.connect();
//     console.log("Connected to PostgreSQL on port 5433");
//   } catch (error) {
//     console.error("Failed to connect on port 5433, trying port 5432...");
//     try {
//       pool = createPool(5432);
//       await pool.connect();
//       console.log("Connected to PostgreSQL on port 5432");
//     } catch (err) {
//       console.error("Failed to connect on both ports 5433 and 5432", err);
//       process.exit(1);
//     }
//   }
// })();

// module.exports = pool;


const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for NeonDB
  },
});

// Test Connection
(async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to Neon PostgreSQL database!");
  } catch (error) {
    console.error("❌ Failed to connect to Neon database:", error);
    process.exit(1);
  }
})();

module.exports = pool;