const express = require("express");
const { createOrder, getOrders } = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate(["user"]), createOrder);
router.get("/", authenticate(["user", "admin"]), getOrders);

module.exports = router;
