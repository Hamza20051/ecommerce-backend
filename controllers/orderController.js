const Order = require('../models/Order');
const Product = require('../models/Product');

/* =========================
   🛒 CREATE ORDER (FIXED)
========================= */
const createOrder = async (req, res) => {
  try {
    const {
      products,
      shippingInfo,
      totalPrice,
      paymentMethod,
      discountCode,
    } = req.body;

    const userId = req.user.id; // ✅ FIX: secure user

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }

    // 🔥 Check stock first (NO DB CHANGES YET)
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }
    }

    // 🧾 CREATE ORDER FIRST
    const newOrder = new Order({
      user: userId,
      products,
      shippingInfo,
      paymentMethod,
      discountCode,
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    // 🔻 THEN DECREASE STOCK SAFELY
    for (const item of products) {
      const product = await Product.findById(item.product);

      product.stock -= item.quantity;

      if (product.stock <= 0) {
        product.stock = 0;
        product.isOutOfStock = true;
      }

      await product.save();
    }

    res.status(201).json(savedOrder);

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

/* =========================
   📦 GET ORDER BY ID
========================= */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('products.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

/* =========================
   👤 USER ORDERS
========================= */
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIXED

    const orders = await Order.find({ user: userId })
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

/* =========================
   🧑‍💼 ADMIN ALL ORDERS
========================= */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
};
