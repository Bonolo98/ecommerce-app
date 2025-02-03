const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const register = async (req, res) => {
  const { username, password, role, email, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userResult = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id",
      [username, hashedPassword, role]
    );

    if (role === "user") {
      await pool.query("INSERT INTO customers (user_id, email, phone) VALUES ($1, $2, $3)", 
        [userResult.rows[0].id, email, phone]);
    }

    res.send("User registered successfully.");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) return res.status(404).send("User not found.");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send("Invalid credentials.");

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.send({ token });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { register, login };
