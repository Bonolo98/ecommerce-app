const express = require("express");
const { addReview, getReviewsByProduct } = require("../controllers/reviewController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate(["user"]), addReview);
// router.get("/", getReviews);
router.get("/:productId", getReviewsByProduct);

module.exports = router;
