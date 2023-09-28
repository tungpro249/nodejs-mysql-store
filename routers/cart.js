const express = require("express");
const {addItemToCart, updateCartItemQuantity, removeItemFromCart, getCartItems} = require("../controllers/cartController");
const router = express.Router();

// Thêm một sản phẩm vào giỏ hàng
router.post('/cart/add', addItemToCart);

// Cập nhật số lượng mặt hàng trong giỏ hàng
router.put('/cart/items/:id', updateCartItemQuantity);

// Xóa một mặt hàng khỏi giỏ hàng
router.delete('/cart/items/:id', removeItemFromCart);

// Lấy danh sách mặt hàng trong giỏ hàng
router.get('/cart/:id/items', getCartItems);

module.exports = router;
