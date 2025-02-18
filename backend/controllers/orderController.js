const pool = require("../db");

exports.placeOrder = async (req, res) => {
  try {
    const { userId, cartItems, totalAmount, shippingAddress, phoneNumber } =
      req.body;

    if (
      !userId ||
      !cartItems ||
      cartItems.length === 0 ||
      !totalAmount ||
      !shippingAddress ||
      !phoneNumber
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data" });
    }

    // Create a new order
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_amount, phone_number, shipping_address, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
      [userId, totalAmount, phoneNumber, shippingAddress]
    );

    const orderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of cartItems) {
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

// exports.getOrders = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
//       userId,
//     ]);
//     res.json(result.rows);
//   } catch (err) {
//     res.status(400).send("Error: " + err.message);
//   }
// };


// exports.getOrders = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "User ID is required" });
//     }

//     const orders = await pool.query(
//       `SELECT o.id, o.total_amount, o.phone_number, o.shipping_address, o.status, o.created_at,
//               json_agg(json_build_object(
//                 'product_id', op.product_id, 
//                 'quantity', op.quantity, 
//                 'unit_price', op.unit_price,
//                 'name', p.name,
//                 'image_url', p.image_url
//               )) AS cart_items
//        FROM orders o
//        JOIN order_products op ON o.id = op.order_id
//        JOIN products p ON op.product_id = p.id
//        WHERE o.user_id = $1
//        GROUP BY o.id
//        ORDER BY o.created_at DESC`,
//       [userId]
//     );

//     res.json({ success: true, orders: orders.rows });
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


exports.getOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT o.id, o.total_amount, o.phone_number, o.shipping_address, o.status, o.created_at,
              COALESCE(json_agg(json_build_object(
                'product_id', op.product_id,
                'quantity', op.quantity,
                'unit_price', op.unit_price,
                'name', p.name,
                'image_url', p.image_url
              )) FILTER (WHERE op.product_id IS NOT NULL), '[]') AS cart_items
       FROM orders o
       LEFT JOIN order_products op ON o.id = op.order_id
       LEFT JOIN products p ON op.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
