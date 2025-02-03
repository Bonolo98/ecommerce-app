const express = require("express");
const { createReview, getReviews, getReviewsByProduct } = require("../controllers/reviewController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate(["user"]), createReview);
router.get("/", getReviews);
router.get("/product/:product_id", getReviewsByProduct);

module.exports = router;
