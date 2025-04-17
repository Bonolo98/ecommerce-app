const {getWishlist} = require("../controllers/wishListController");

const express = require("express");
const router = express.Router();

router.get("/", getWishlist);

module.exports = router;
