const express = require("express");
const {addNewCart, updateCart, deleteCart} = require("../controllers/cartController");
const router = express.Router();

router.post("/add-cart", addNewCart);
router.post("/update-cart", updateCart);
router.post("/delete-cart", deleteCart);

module.exports = router;
