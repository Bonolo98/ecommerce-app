

const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orderController');

router.post('/place', ordersController.placeOrder);
router.get('/user/:userId', ordersController.getOrders);

module.exports = router;