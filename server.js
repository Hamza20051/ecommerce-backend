require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db.js');

const authRoutes = require('./routers/auth');
const cartRoutes = require('./routers/cart');
const orderRoutes = require('./routers/order');
const productRoutes = require('./routers/product');
const wishlistRoutes = require('./routers/wishlist');
const aiRoutes = require('./routers/ai');
const adminRoutes = require('./routers/admin');
const subscribeRoutes = require('./routers/subscribe');

const startServer = async () => {
  try {
    await connectDB();

    const app = express();
    const PORT = process.env.PORT || 5000;

    // ✅ Middleware
    app.use(express.json());

    // ✅ FIXED CORS CONFIGURATION
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://wearityy-frontend.vercel.app',
      'https://wearityy.com',
      'https://www.wearityy.com'
    ];

    app.use(cors({
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps / postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error('CORS not allowed for this origin: ' + origin));
        }
      },
      credentials: true
    }));

    // ✅ Logger
    app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.url}`);
      next();
    });

    // ✅ Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/wishlist', wishlistRoutes);
    app.use('/api/ai', aiRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/subscribe', subscribeRoutes);

    console.log("✅ Routes are set up");

    // ✅ Error handling
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    });

    // ✅ 404 handler
    app.use((req, res) => {
      res.status(404).json({ message: 'Route Not Found' });
    });

    // ✅ Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
  }
};

startServer();
