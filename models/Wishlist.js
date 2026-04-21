const express = require("express");
const Wishlist = require("../models/Wishlist");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   ADD TO WISHLIST
========================= */
router.post("/add", protect, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const exists = await Wishlist.findOne({ userId, productId });
    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    res.json(wishlistItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
});

/* =========================
   REMOVE FROM WISHLIST
========================= */
router.delete("/remove/:productId", protect, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    await Wishlist.findOneAndDelete({ userId, productId });
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove" });
  }
});

/* =========================
   GET USER WISHLIST
========================= */
router.get("/me", protect, async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id })
      .populate("productId");

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load wishlist" });
  }
});

module.exports = router;
