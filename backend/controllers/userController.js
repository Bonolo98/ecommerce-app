const pool = require("../db");

const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, role FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, role FROM users WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).send("User not found");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.send("User deleted.");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { getUsers, getUserById, deleteUser };
