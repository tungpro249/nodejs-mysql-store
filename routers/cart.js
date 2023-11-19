const express = require("express");
const {getCart, addToCart, increaseCartItem, removeFromCart, getAllCarts, decreaseCartItem} = require("../controllers/cartController");
const router = express.Router();

// Lấy thông tin giỏ hàng của một người dùng cụ thể
router.get('/cart/:userId', getCart);

router.post('/cart/:userId/add', addToCart);

router.put('/cart/item/:cartItemId', increaseCartItem);

router.put('/cart/item-decrease/:cartItemId', decreaseCartItem);

router.delete('/cart/item/:cartItemId', removeFromCart);

// Lấy thông tin về tất cả các giỏ hàng của nhiều người dùng trong hệ thống
router.get('/carts', getAllCarts);

module.exports = router;
