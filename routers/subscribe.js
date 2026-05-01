const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

/* ==============================
   📩 SUBSCRIBE ROUTE (PUBLIC)
================================ */
router.post('/', async (req, res) => {
  try {
    let { email } = req.body;

    // 🔹 Validate input
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    // 🔹 Normalize
    email = email.trim().toLowerCase();

    // 🔹 Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // 🔹 Check duplicate
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Already subscribed' });
    }

    // 🔹 Save subscriber
    await Subscriber.create({ email });

    res.status(201).json({
      message: 'Successfully subscribed!'
    });

  } catch (err) {
    console.error('Subscribe Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
