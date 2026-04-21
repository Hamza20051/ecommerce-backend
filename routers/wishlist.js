const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

/* ==============================
   ❤️ ADD TO WISHLIST
================================ */
router.post('/add/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json({
      message: 'Product added to wishlist',
      wishlist: user.wishlist
    });

  } catch (error) {
    console.error('❌ Wishlist Add Error:', error);
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
});

/* ==============================
   ❌ REMOVE FROM WISHLIST (FIXED)
================================ */
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(
      item => item.toString() !== productId
    );

    await user.save();

    res.json({
      message: 'Product removed from wishlist',
      wishlist: user.wishlist
    });

  } catch (error) {
    console.error('❌ Wishlist Remove Error:', error);
    res.status(500).json({ error: 'Failed to remove product from wishlist' });
  }
});

/* ==============================
   ❤️ GET MY WISHLIST (ONLY SAFE WAY)
================================ */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.wishlist);

  } catch (error) {
    console.error('❌ Wishlist Fetch Error:', error);
    res.status(500).json({ error: 'Failed to retrieve wishlist' });
  }
});

module.exports = router;
