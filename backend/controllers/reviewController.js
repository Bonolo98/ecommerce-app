const pool = require("../db");

const createReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;

  try {
    await pool.query("INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4)", 
      [req.user.id, product_id, rating, comment]);
    res.send("Review added successfully.");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const getReviews = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews");
    res.json(result.rows);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews WHERE product_id = $1", [req.params.product_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { createReview, getReviews, getReviewsByProduct };
