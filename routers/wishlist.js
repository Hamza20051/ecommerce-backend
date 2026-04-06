const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// ✅ Add a product to the wishlist (accepts :productId in URL)
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

    // Avoid throwing error on duplicate
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
});

// ✅ Remove product from the wishlist
router.post('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
    await user.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove product from wishlist' });
  }
});

// ✅ Get wishlist for a specific user by ID (admin use or profile pages)
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve wishlist' });
  }
});

// ✅ Get wishlist for the logged-in user (simpler, secure)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve wishlist' });
  }
});

module.exports = router;
