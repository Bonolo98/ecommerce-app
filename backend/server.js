const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishListRoutes = require("./routes/wishListRoutes");

const { logger } = require("./middleware/logger");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(logger);

// app.use(
//   cors({
//     origin: [
//       "http://localhost:4200",
//       "https://ecommerce-9aaslz4fy-bonolos-projects-1c1373ab.vercel.app",
//       "https://ecommerce-app-bonolos-projects-1c1373ab.vercel.app",
//       "https://ecommerce-app-zp2y.onrender.com",
//     ],
//     methods: "GET, POST, PUT, DELETE",
//     credentials: true,
//     allowedHeaders: "Content-Type, Authorization",
//   }),
// );

app.use(cors({ origin: true, credentials: true }));

// const allowedOrigins = [
//   "http://localhost:4200",
//   "https://ecommerce-9aaslz4fy-bonolos-projects-1c1373ab.vercel.app",
//   "https://ecommerce-app-bonolos-projects-1c1373ab.vercel.app",
//   "https://ecommerce-app-zp2y.onrender.com",
// ];

app.use(
  cors({
    origin: function (origin, callback) {
      if (origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/search", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishListRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
