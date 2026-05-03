const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

/* =========================
   🛒 GET CART
========================= */
router.get('/:userId', getCart);

/* =========================
   ➕ ADD TO CART
========================= */
router.post('/:userId', addToCart);

/* =========================
   ❌ REMOVE ITEM
========================= */
router.delete('/:userId/:productId', removeFromCart);

/* =========================
   🧹 CLEAR CART
========================= */
router.delete('/:userId', clearCart);

module.exports = router;
