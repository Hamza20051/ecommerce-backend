const Order = require('../models/Order');
const Product = require('../models/Product');

// Create Order
const createOrder = async (req, res) => {
  try {
    const { user, products, shippingInfo, totalPrice, paymentMethod, discountCode } = req.body;
      // 🔥 STOCK DECREASE LOGIC
      for (const item of products) {
        const product = await Product.findById(item.product);
  
        if (!product)
          return res.status(404).json({ message: 'Product not found' });
  
        if (product.stock < item.quantity)
          return res.status(400).json({
            message: `${product.name} is out of stock`,
          });
  
         // 🔻 Deduct stock
      product.stock -= item.quantity;

      // ✅ Auto out-of-stock
      if (product.stock === 0) {
        product.isOutOfStock = true; // optional but recommended
      }
      await product.save();
    }
    const newOrder = new Order({
      user,
      products,
      shippingInfo,
      paymentMethod,
      discountCode,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Get orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// ✅ Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error });
  }
};

module.exports = { createOrder, getOrderById, getOrdersByUser, getAllOrders };
