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

    // =========================
    // Middleware
    // =========================
    app.use(express.json());

    // =========================
    // ✅ FIXED CORS (ONLY CHANGE)
    // =========================
    app.use(cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://wearityy-frontend.vercel.app',
        'https://wearityy.com',
        'https://www.wearityy.com'
      ],
      credentials: true
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }));
  app.options('*', cors());

    // =========================
    // REQUEST LOGGER
    // =========================
    app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.url}`);
      next();
    });

    // =========================
    // ROOT ROUTE
    // =========================
    app.get('/', (req, res) => {
      res.json({
        status: 'OK',
        message: '🚀 Wearity API is running successfully',
      });
    });

    // =========================
    // API ROUTES
    // =========================
    app.use('/api/auth', authRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/wishlist', wishlistRoutes);
    app.use('/api/ai', aiRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/subscribe', subscribeRoutes);

    // =========================
    // ERROR HANDLER
    // =========================
    app.use((err, req, res, next) => {
      console.error('❌ Server Error:', err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    });

    // =========================
    // 404 HANDLER
    // =========================
    app.use((req, res) => {
      res.status(404).json({ message: 'Route Not Found' });
    });

    // =========================
    // START SERVER
    // =========================
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
  }
};

startServer();
