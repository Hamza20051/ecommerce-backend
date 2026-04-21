const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

/**
 * ✅ Get all users (admin only)
 */
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

/**
 * ✅ Toggle admin role
 */
router.put('/toggle-admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: 'Admin status updated',
      isAdmin: user.isAdmin,
    });

  } catch (error) {
    console.error('Error updating admin status:', error);
    res.status(500).json({ message: 'Server error while updating admin' });
  }
});

module.exports = router;
