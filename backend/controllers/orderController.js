const pool = require("../db");

exports.placeOrder = async (req, res) => {
  const { userId, cartItems, totalAmount, shippingAddress, phoneNumber } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, phone_number)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [userId, totalAmount, shippingAddress, phoneNumber]
    );
    const orderId = orderResult.rows[0].id;

    const productIds = cartItems.map(item => item.productId);
    const { rows: existingProducts } = await client.query(
      `SELECT id FROM products WHERE id = ANY($1)`,
      [productIds]
    );
    const existingProductIds = new Set(existingProducts.map(product => product.id));

    const invalidItems = cartItems.filter(item => !existingProductIds.has(item.productId));

    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid product IDs found: ${invalidItems.map(item => item.productId).join(", ")}. Please remove them from your cart.`,
      });
    }

    const orderProductsQuery = `
      INSERT INTO order_products (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of cartItems) {
      await client.query(orderProductsQuery, [orderId, item.productId, item.quantity, item.price]);
    }

    await client.query("COMMIT");

    res.status(200).json({ success: true, message: "Order placed successfully!" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
};


exports.getOrders = async (req, res) => {
  const { userId } = req.params; // Get userId from request parameters

  const client = await pool.connect();
  try {
    // Step 1: Fetch Orders for the User
    const ordersQuery = `
      SELECT id, total_amount, shipping_address, phone_number, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const ordersResult = await client.query(ordersQuery, [userId]);
    const orders = ordersResult.rows;

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found." });
    }

    // Step 2: Fetch Products for Each Order
    const orderIds = orders.map(order => order.id);
    const orderProductsQuery = `
      SELECT op.order_id, op.product_id, p.name, op.quantity, op.price
      FROM order_products op
      JOIN products p ON op.product_id = p.id
      WHERE op.order_id = ANY($1)
    `;

    const orderProductsResult = await client.query(orderProductsQuery, [orderIds]);
    const orderProducts = orderProductsResult.rows;

    // Step 3: Attach Products to Their Respective Orders
    const ordersWithProducts = orders.map(order => ({
      ...order,
      products: orderProducts.filter(op => op.order_id === order.id),
    }));

    res.status(200).json({ success: true, orders: ordersWithProducts });

  } catch (error) {
    console.error("Get Orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
};

