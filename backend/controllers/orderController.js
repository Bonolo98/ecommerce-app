const pool = require("../db");

const createOrder = async (req, res) => {
  const { products, shipping_address_id, billing_address_id } = req.body;

  try {
    let totalAmount = 0;
    for (const item of products) {
      const result = await pool.query("SELECT * FROM products WHERE id = $1", [item.productId]);
      const product = result.rows[0];

      if (!product || product.stock < item.quantity) {
        return res.status(400).send(`Insufficient stock for product ID ${item.productId}`);
      }

      totalAmount += product.price * item.quantity;
      await pool.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [item.quantity, item.productId]);
    }

    const orderResult = await pool.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address_id, billing_address_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [req.user.id, totalAmount, shipping_address_id, billing_address_id]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of products) {
      await pool.query("INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)", 
        [orderId, item.productId, item.quantity]);
    }

    res.send("Order placed successfully.");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { createOrder, getOrders };
