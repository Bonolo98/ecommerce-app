const pool = require("../db");


// exports.placeOrder = async (req, res) => {
//   try {
//     const { userId, cartItems, totalAmount, shippingAddress, phoneNumber } =
//       req.body;

//     if (
//       !userId ||
//       !cartItems ||
//       cartItems.length === 0 ||
//       !totalAmount ||
//       !shippingAddress ||
//       !phoneNumber
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid request data" });
//     }

//     // Create a new order
//     const orderResult = await pool.query(
//       `INSERT INTO orders (user_id, total_amount, phone_number, shipping_address, created_at) 
//        VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
//       [userId, totalAmount, phoneNumber, shippingAddress]
//     );

//     const orderId = orderResult.rows[0]?.id;
//     if (!orderId) {
//       throw new Error("Failed to create order");
//     }

//     // Insert order items
//     for (const item of cartItems) {
//       if (!item.productId || !item.quantity || !item.price) {
//         throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
//       }

//       await pool.query(
//         `INSERT INTO order_products (order_id, product_id, quantity, price) 
//          VALUES ($1, $2, $3, $4)`,
//         [orderId, item.productId, item.quantity, item.price]
//       );
//     }

//     // Clear the cart after placing the order
//     await pool.query(`DELETE FROM cart WHERE user_id = $1`, [userId]);

//     res.json({ success: true, message: "Order placed successfully", orderId });
//   } catch (error) {
//     console.error("Order placement error:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

exports.placeOrder = async (req, res) => {
  const { userId, cartItems, totalAmount, shippingAddress, phoneNumber, paymentDetails } = req.body;

  try {
    // Step 1: Extract product IDs from cartItems
    const productIds = cartItems.map(item => item.productId);

    // Step 2: Check if all product IDs exist in the products table
    const { rows: existingProducts } = await pool.query(
      `SELECT id FROM products WHERE id = ANY($1)`,
      [productIds]
    );

    // Step 3: Convert existing product IDs to a Set for quick lookup
    const existingProductIds = new Set(existingProducts.map(product => product.id));

    // Step 4: Validate each cart item before proceeding
    for (const item of cartItems) {
      if (!existingProductIds.has(item.productId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${item.productId} does not exist. Please remove it from your cart.`,
        });
      }
    }

    // Continue with order placement...
    // Insert order into `orders` table, then insert into `order_products`
    
    res.status(200).json({ success: true, message: "Order placed successfully!" });

  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


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
