const Order = require('../models/Order');
const Product = require('../models/Product');

/* =========================
   🛒 CREATE ORDER (GUEST + USER SUPPORT)
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

    // 👤 SUPPORT GUEST CHECKOUT
    const userId = req.user?.id || null;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }

    // 🔥 CHECK STOCK FIRST
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

    // 🧾 CREATE ORDER (GUEST SAFE)
    const newOrder = new Order({
      user: userId || undefined,
      isGuest: !userId,   // ✅ important for guest tracking
      products,
      shippingInfo,
      paymentMethod,
      discountCode,
      totalPrice,
      status: 'Pending',
      isPaid: false,
    });

    const savedOrder = await newOrder.save();

    // 🔻 REDUCE STOCK
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
    console.error('Get Order Error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};


/* =========================
   👤 USER ORDERS (ONLY IF LOGGED IN)
========================= */
const getOrdersByUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Login required' });
    }

    const orders = await Order.find({ user: req.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error('User Orders Error:', error);
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
    console.error('All Orders Error:', error);
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};


/* =========================
   🔄 UPDATE ORDER STATUS
========================= */
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);

  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};


/* =========================
   EXPORTS
========================= */
module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus
};
