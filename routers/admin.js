const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

/**
 * ✅ Get all users (admin only)
 */
router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

/**
 * ✅ Make / remove admin
 */
router.put(
  '/toggle-admin/:id',
  protect,
  adminOnly,
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: `Admin status updated`,
      isAdmin: user.isAdmin,
    });
  }
);

module.exports = router;
