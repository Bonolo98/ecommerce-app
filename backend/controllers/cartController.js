const pool = require("../db");

exports.getAllCartItems = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming the userId is passed as a parameter

    // Fetch all cart items for the user
    const cartItems = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [userId]
    );

    if (cartItems.rows.length === 0) {
      return res
        .status(204)
        .json({ success: false, message: "No items in the cart" });
    }

    res.json({ success: true, cart: cartItems.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { userId, items, productId } = req.body;
    let itemsToProcess = items;

    if (!items && productId) {
      itemsToProcess = [{ productId, quantity: 1 }];
    }

    if (!itemsToProcess || itemsToProcess.length === 0) {
      return res.status(400).json({ success: false, message: "No items to sync" });
    }

    for (const item of itemsToProcess) {
      const { productId, quantity } = item;

      const existingItem = await pool.query(
        "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
        [userId, productId]
      );

      if (existingItem.rows.length > 0) {
        await pool.query(
          "UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
          [quantity, userId, productId]
        );
      } else {
        await pool.query(
          "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
          [userId, productId, quantity]
        );
      }
    }

    res.json({ success: true, message: "Items synced to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if product exists in the cart
    const existingItem = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    // const existingItem = await pool.query(
    //   `SELECT c.id, c.quantity, p.name, p.price, p.image
    //          FROM cart c
    //          JOIN products p ON c.product_id = p.id
    //          WHERE c.user_id = $1`,
    //   [userId, productId]
    // );

    if (existingItem.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    // If quantity > 1, decrease quantity; otherwise, remove item
    if (existingItem.rows[0].quantity > 1) {
      await pool.query(
        "UPDATE cart SET quantity = quantity - 1 WHERE user_id = $1 AND product_id = $2",
        [userId, productId]
      );
    } else {
      await pool.query(
        "DELETE FROM cart WHERE user_id = $1 AND product_id = $2",
        [userId, productId]
      );
    }

    // Fetch updated cart
    const cartItems = await pool.query(
      `SELECT c.id, c.quantity, p.name, p.price, p.image 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = $1`,
      [userId]
    );

    res.json({ success: true, cart: cartItems.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    await pool.query("DELETE FROM cart WHERE user_id = $1", [userId]);

    res.json({ success: true, cart: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
