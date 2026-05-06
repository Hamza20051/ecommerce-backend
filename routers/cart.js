const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

/* =========================
   ADD TO CART
========================= */
router.post("/:guestId", addToCart);

/* =========================
   GET CART
========================= */
router.get("/:guestId", getCart);

/* =========================
   REMOVE SINGLE ITEM
========================= */
router.delete("/:guestId/:productId", removeFromCart);

/* =========================
   CLEAR FULL CART
========================= */
router.delete("/:guestId", clearCart);

module.exports = router;
