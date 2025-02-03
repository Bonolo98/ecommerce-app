const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { createProduct, getProducts, deleteProduct, getProductById, searchProducts } = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById)
router.post("/", authenticate(["admin"]), createProduct);
router.delete("/:id", authenticate(["admin"]), deleteProduct);


module.exports = router;
