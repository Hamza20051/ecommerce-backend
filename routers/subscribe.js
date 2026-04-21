const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

/* ==============================
   📩 SUBSCRIBE ROUTE
================================ */
router.post('/', async (req, res) => {
  try {
    let { email } = req.body;

    // 🔹 Basic validation
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    // 🔹 Normalize email
    email = email.trim().toLowerCase();

    // 🔹 Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // 🔹 Check existing subscriber
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // 🔹 Save subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({
      message: 'Successfully subscribed!'
    });

  } catch (err) {
    console.error('❌ Subscribe Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
