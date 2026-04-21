const express = require('express');
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/* ==============================
   🛒 CREATE ORDER (USER ONLY)
================================ */
router.post('/', protect, createOrder);

/* ==============================
   📦 GET SINGLE ORDER
================================ */
router.get('/:id', protect, getOrderById);

/* ==============================
   👤 GET USER ORDERS (SECURE)
================================ */
router.get('/user/:userId', protect, getOrdersByUser);

/* ==============================
   🔐 ADMIN: ALL ORDERS
================================ */
router.get('/', protect, adminOnly, getAllOrders);

module.exports = router;
