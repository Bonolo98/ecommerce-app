const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

const authenticate = (roles = []) => async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied: No token provided.");

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).send("Access denied: Insufficient permissions.");
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = { authenticate };
