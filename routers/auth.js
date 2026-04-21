const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile
} = require('../controllers/authController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

/* ==============================
   ✅ TEST ROUTE
================================ */
router.get('/ping', (req, res) => {
  res.send('✅ Auth router is working');
});

/* ==============================
   🔐 AUTH ROUTES
================================ */
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

/* ==============================
   🛡 ADMIN TEST ROUTE
================================ */
router.get('/admin', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});

/* ==============================
   ⚠️ MAKE ADMIN (SECURE VERSION)
================================ */
router.put('/make-admin/:userId', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({
      message: 'User promoted to admin successfully',
      user
    });

  } catch (err) {
    console.error('❌ Make Admin Error:', err);
    res.status(500).json({
      message: 'Error promoting user',
      error: err.message
    });
  }
});

module.exports = router;
