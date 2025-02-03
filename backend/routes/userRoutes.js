const express = require("express");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate(["admin"]), getUsers);
router.get("/:id", authenticate(["admin", "user"]), getUserById);
router.delete("/:id", authenticate(["admin"]), deleteUser);

module.exports = router;
