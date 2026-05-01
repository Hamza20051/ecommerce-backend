const express = require('express');
const mongoose = require('mongoose');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

/* =========================
   GET ALL USERS
========================= */
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

/* =========================
   TOGGLE ADMIN ROLE
========================= */
router.put('/toggle-admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot change your own admin status"
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const adminCount = await User.countDocuments({ isAdmin: true });

    if (user.isAdmin && adminCount === 1) {
      return res.status(400).json({
        message: "Cannot remove the last admin"
      });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: 'Admin status updated',
      user: {
        id: user._id,
        isAdmin: user.isAdmin,
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error while updating admin' });
  }
});

module.exports = router;
