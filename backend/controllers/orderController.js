// const pool = require("../db");

// const createOrder = async (req, res) => {
//   const { products, shipping_address_id, billing_address_id } = req.body;

//   try {
//     let totalAmount = 0;
//     for (const item of products) {
//       const result = await pool.query("SELECT * FROM products WHERE id = $1", [item.productId]);
//       const product = result.rows[0];

//       if (!product || product.stock < item.quantity) {
//         return res.status(400).send(`Insufficient stock for product ID ${item.productId}`);
//       }

//       totalAmount += product.price * item.quantity;
//       await pool.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [item.quantity, item.productId]);
//     }

//     const orderResult = await pool.query(
//       "INSERT INTO orders (user_id, total_amount, shipping_address_id, billing_address_id) VALUES ($1, $2, $3, $4) RETURNING id",
//       [req.user.id, totalAmount, shipping_address_id, billing_address_id]
//     );

//     const orderId = orderResult.rows[0].id;

//     for (const item of products) {
//       await pool.query("INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)", 
//         [orderId, item.productId, item.quantity]);
//     }

//     res.send("Order placed successfully.");
//   } catch (err) {
//     res.status(400).send("Error: " + err.message);
//   }
// };

// const getOrders = async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.user.id]);
//     res.json(result.rows);
//   } catch (err) {
//     res.status(400).send("Error: " + err.message);
//   }
// };

// module.exports = { createOrder, getOrders };






const pool = require('../db'); // Adjust path as needed

exports.placeOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress, phoneNumber } = req.body;

    if (!userId || !items || items.length === 0 || !totalAmount || !shippingAddress || !phoneNumber) {
      return res.status(400).json({ success: false, message: "Invalid request data" });
    }

    // Create a new order
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_amount, phone_number, shipping_address, status, created_at) 
       VALUES ($1, $2, $3, $4 'Pending', NOW()) RETURNING id`,
      [userId, totalAmount, shippingAddress, phoneNumber]
    );

    const orderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_products (order_id, product_id, quantity, unit_price) 
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    // Clear the cart after placing the order
    await pool.query(`DELETE FROM cart WHERE user_id = $1`, [userId]);

    res.json({ success: true, message: "Order placed successfully", orderId });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getOrders = async (req, res) => {
  try {

    const { userId } = req.params; 

    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};
