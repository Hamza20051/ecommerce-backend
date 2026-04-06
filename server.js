require('dotenv').config();
const express = require('express');

const connectDB = require('./config/db.js');
const authRoutes = require('./routers/auth');
const cartRoutes = require('./routers/cart');
const orderRoutes = require('./routers/order');
const productRoutes = require('./routers/product');
const wishlistRoutes = require('./routers/wishlist');
const cors = require('cors');
const aiRoutes = require('./routers/ai');
const adminRoutes = require('./routers/admin');
const subscribeRoutes = require('./routers/subscribe');
 // Load environment variables

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();  // Make sure MongoDB connection is established

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(express.json());
    app.use(cors({
      origin: ['http://localhost:3000','http://localhost:5173'], // Allow requests from frontend
    })); // Enable CORS for all routes
    app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.url}`);
      next();
    });
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/wishlist', wishlistRoutes);
    app.use('/api/ai', aiRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/subscribe', subscribeRoutes);
    console.log("Routes are set up and the server is running on port 5000.");


    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send({ message: 'Internal Server Error' });
    });

    // 404 error handling for undefined routes
    app.use((req, res, next) => {
      res.status(404).send({ message: 'Route Not Found' });
    });
    app.use((req, res) => {
      res.status(404).json({ message: 'Route Not Found' });
    });
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

startServer();
