const express = require('express');
const mongoose = require('mongoose');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

/* =========================
   👑 GET ADMIN USERS ONLY
========================= */
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: true }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching admins' });
  }
});
module.exports = router;
