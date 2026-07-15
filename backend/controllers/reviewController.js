const pool = require("../db");

exports.addReview = async (req, res) => {
  try {
    const { productId, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    await pool.query(
      `INSERT INTO reviews (user_id, product_id, comment, created_at) VALUES ($1, $2, $3, NOW())`,
      [userId, productId, comment],
    );

    res.json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.username 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = $1 ORDER BY r.created_at DESC`,
      [productId],
    );

    res.json({ success: true, reviews: reviews.rows });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
