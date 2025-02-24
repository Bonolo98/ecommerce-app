const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.delete('/:userId', cartController.removeFromCart);
router.post('/clear', cartController.clearCart);
router.get('/:userId', cartController.getAllCartItems)


module.exports = router;
