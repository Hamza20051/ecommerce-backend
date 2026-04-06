const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const User = require('../models/User');
// ✅ 1. Test route to ensure file is connected
router.get('/ping', (req, res) => {
  res.send('✅ Auth router is working');
});
router.get('/admin', protect, (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});
router.put('/make-admin/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.isAdmin = true;
      await user.save();
  
      res.json({ message: 'User promoted to admin via GET', user });
    } catch (err) {
      res.status(500).json({ message: 'Error promoting user', error: err });
    }
  });
 
// Only one version of each route!
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
