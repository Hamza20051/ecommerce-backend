const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/* ==============================
   🛒 GET CART (secure)
================================ */
router.get('/:userId', protect, getCart);

/* ==============================
   ➕ ADD TO CART
================================ */
router.post('/:userId', protect, addToCart);

/* ==============================
   ❌ REMOVE ITEM FROM CART
================================ */
router.delete('/:userId/:productId', protect, removeFromCart);

/* ==============================
   🧹 CLEAR CART
================================ */
router.delete('/:userId', protect, clearCart);

module.exports = router;
