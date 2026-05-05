const express = require('express');
const {
  createOrder,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/* CREATE ORDER */
router.post('/', createOrder);

/* ✅ GET ALL ORDERS (FIX) */
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await require('../models/Order')
      .find()
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

/* UPDATE STATUS */
router.put('/status/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
