const express = require('express');
const {createOrder, getOrder, updateOrder, deleteOrder, getAllOrders} = require("../controllers/orderController");
const router = express.Router();

router.post('/payment', createOrder);
router.get('/orders/:id', getOrder);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

module.exports = router;