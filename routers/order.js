const express = require('express');
const { createOrder, getOrderById, getOrdersByUser , getAllOrders } = require('../controllers/orderController');

const router = express.Router();
//router.post('/', placeOrder);
const { protect, adminOnly } = require('../middleware/authMiddleware'); // ✅ Import middleware

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/user/:userId', getOrdersByUser);
router.get('/', protect, adminOnly, getAllOrders);
module.exports = router;
