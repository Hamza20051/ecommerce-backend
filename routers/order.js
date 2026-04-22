const express = require('express');
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/* CREATE ORDER */
router.post('/', protect, createOrder);

/* SINGLE ORDER */
router.get('/:id', protect, getOrderById);

/* USER ORDERS */
router.get('/user/:userId', protect, getOrdersByUser);

/* ADMIN ALL ORDERS */
router.get('/', protect, adminOnly, getAllOrders);

/* ⭐ NEW: UPDATE STATUS */
router.put('/status/:id', updateOrderStatus);

module.exports = router;
