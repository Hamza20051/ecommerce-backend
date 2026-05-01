const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   ADD TO WISHLIST
========================= */
router.post("/add", protect, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({ message: "Added to wishlist", wishlist: user.wishlist });

  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
});

/* =========================
   REMOVE FROM WISHLIST
========================= */
router.delete("/remove/:productId", protect, async (req, res) => {
  const productId = req.params.productId;

  try {
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.json({ message: "Removed from wishlist", wishlist: user.wishlist });

  } catch (err) {
    res.status(500).json({ message: "Failed to remove" });
  }
});

/* =========================
   GET USER WISHLIST
========================= */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist");

    res.json(user.wishlist);

  } catch (err) {
    res.status(500).json({ message: "Failed to load wishlist" });
  }
});

module.exports = router;
