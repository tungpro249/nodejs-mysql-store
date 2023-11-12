const express = require('express');
const {createOrder, getOrder, updateOrder, deleteOrder, getAllOrders, getOrderDetails, fuck} = require("../controllers/orderController");
const router = express.Router();

router.post('/payment', createOrder);
// xem chi tiết đơn hàng
router.get('/orders/:id', getOrder);
// xem tất cả đơn hàng
router.get('/orders', getAllOrders);
// xem đơn hàng của user thông qua user_id
router.get('/order/:id', getOrderDetails);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

router.post('/place-order', fuck)

module.exports = router;