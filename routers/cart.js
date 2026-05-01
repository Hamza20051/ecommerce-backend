const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

/* ==============================
   🛒 GET CART (guest safe)
================================ */
router.get('/', getCart);

/* ==============================
   ➕ ADD TO CART
================================ */
router.post('/', addToCart);

/* ==============================
   ❌ REMOVE ITEM
================================ */
router.delete('/:productId', removeFromCart);

/* ==============================
   🧹 CLEAR CART
================================ */
router.delete('/', clearCart);

module.exports = router;
