const express = require('express');
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/* =========================
   🛒 CREATE ORDER (GUEST)
========================= */
router.post('/', createOrder);

/* =========================
   📦 GET ORDER BY ID (PUBLIC / GUEST SAFE)
========================= */
router.get('/:id', getOrderById);

/* =========================
   👑 ADMIN - ALL ORDERS
========================= */
router.get('/', protect, adminOnly, getAllOrders);

/* =========================
   🔄 UPDATE ORDER STATUS (ADMIN ONLY)
========================= */
router.put('/status/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
