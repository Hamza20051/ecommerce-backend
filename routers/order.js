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
   👤 GET USER ORDERS (LOGGED-IN USER)
================================ */
router.get('/my', protect, getOrdersByUser);

/* ==============================
   📦 GET SINGLE ORDER
================================ */
router.get('/:id', protect, getOrderById);

/* ==============================
   🔐 ADMIN: ALL ORDERS
================================ */
router.get('/', protect, adminOnly, getAllOrders);

module.exports = router;
