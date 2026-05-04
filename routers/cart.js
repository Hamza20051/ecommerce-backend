const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/cartController");

router.post("/:guestId", addToCart);
router.get("/:guestId", getCart);
router.delete("/:guestId/:productId", removeFromCart);

module.exports = router;
