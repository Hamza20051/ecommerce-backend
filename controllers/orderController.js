const Order = require('../models/Order');

/* =========================
   CREATE ORDER
========================= */
const createOrder = async (req, res) => {
  try {
    const {
      guestId,
      products,
      shippingInfo,
      totalPrice,
      paymentMethod,
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products" });
    }

    const order = new Order({
      guestId,
      products,
      shippingInfo,
      totalPrice,
      paymentMethod,
      status: "Pending",
      isPaid: false,
    });

    const saved = await order.save();

    res.status(201).json(saved);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order error" });
  }
};

/* =========================
   ADMIN CONFIRM ORDER
========================= */
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;

    // 🔥 mark paid if confirmed
    if (req.body.status === "Confirmed") {
      order.isPaid = true;
    }

    const updated = await order.save();

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  createOrder,
  updateOrderStatus,
};
