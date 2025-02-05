const pool = require("../db");
const { paginate } = require("../utils/pagination");

const createProduct = async (req, res) => {
  const { name, price, stock, category_id } = req.body;

  try {
    await pool.query(
      "INSERT INTO products (name, price, stock, category_id, is_deleted) VALUES ($1, $2, $3, $4, FALSE)", 
      [name, price, stock, category_id]
    );
    res.send("Product created successfully.");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        "SELECT * FROM products WHERE id = $1 AND is_deleted = FALSE",
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).send("Product not found.");
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
};
  
const getProducts = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const query = paginate("SELECT * FROM products WHERE is_deleted = FALSE", { limit, page });
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await pool.query("UPDATE products SET is_deleted = TRUE WHERE id = $1", [req.params.id]);
    res.send("Product deleted (soft delete).");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};


module.exports = { createProduct, getProducts, deleteProduct, getProductById };
