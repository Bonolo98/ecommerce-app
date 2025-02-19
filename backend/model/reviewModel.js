const express = require('express');
const router = express.Router();
const { addReview, getReviewsByProduct } = require('../controllers/reviewController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, addReview); // Add a review (requires login)
router.get('/:productId', getReviewsByProduct); // Get reviews for a product

module.exports = router;
