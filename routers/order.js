const express = require('express');
const {
  createOrder,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/* =========================
   🛒 CREATE ORDER (GUEST)
========================= */
router.post('/', createOrder);

/* =========================
   👑 ADMIN - UPDATE STATUS
========================= */
router.put('/status/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
