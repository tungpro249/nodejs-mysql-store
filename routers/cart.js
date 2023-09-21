const express = require("express");
const {addNewCart, updateCart, deleteCart, getCart} = require("../controllers/cartController");
const router = express.Router();

router.get("/get-cart", getCart);
router.post("/add-cart", addNewCart);
router.post("/update-cart", updateCart);
router.post("/delete-cart", deleteCart);

module.exports = router;
