const pool = require("../db");

exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params.id;

    const wishListItems = await pool.query(
      `SELECT w.id, w.user_id, w.product_id, w.created_at 
        FROM wishlist w
        JOIN users u ON w.user_id = u.id
        JOIN products p ON w.product_id = p.id
        WHERE user_id = $1`,
      [userId]
    );

    if (wishListItems.rows.length === 0) {
      return res
        .status(204)
        .json({ success: false, message: " No items in the wishlist" });
    }

    res.json({ success: true, wishlist: wishListItems.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Getting server error" });
  }
};
