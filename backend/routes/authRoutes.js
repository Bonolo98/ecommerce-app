const express = require("express");
const { register, login, getUserProfile } = require("../controllers/authController");
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/profile', authenticate, getUserProfile);

module.exports = router;
