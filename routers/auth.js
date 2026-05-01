const express = require('express');
const {
  loginUser
} = require('../controllers/authController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/* ==============================
   ✅ TEST ROUTE
================================ */
router.get('/ping', (req, res) => {
  res.send('✅ Auth router is working');
});

/* ==============================
   🔐 ADMIN LOGIN ONLY
================================ */
router.post('/login', loginUser);

/* ==============================
   🛡 ADMIN TEST ROUTE
================================ */
router.get('/admin', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
});

module.exports = router;
