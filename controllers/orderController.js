const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const Product = require('../models/Product');
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
      status: paymentMethod === "COD" ? "Confirmed" : "Pending",
      isPaid: paymentMethod === "COD" ? true : false,
    });

    const saved = await order.save();
    // ✅ REDUCE PRODUCT STOCK
for (const item of products) {

  const product = await Product.findById(item.product);

  if (product) {

    product.stock -= item.quantity;

    // ✅ PREVENT NEGATIVE STOCK
    if (product.stock <= 0) {
      product.stock = 0;
      product.isOutOfStock = true;
    }

    await product.save();
  }
}
    /* =========================
       📧 SEND EMAIL AFTER ORDER
    ========================= */
    try {

      await sendEmail(
        shippingInfo.email,
        paymentMethod === "COD"
          ? "Order Confirmed - Wearity"
          : "Order Pending Verification - Wearity",

        paymentMethod === "COD"
          ? `Hello ${shippingInfo.name},

Your order (${saved._id}) has been confirmed 🎉

Thank you for shopping with Wearity.
`
          : `Hello ${shippingInfo.name},

Your order (${saved._id}) has been placed successfully.

Please send your payment screenshot on WhatsApp for verification.

After verification, your order will be confirmed.

Thank you for shopping with Wearity.
`
      );

    } catch (emailError) {
      console.log("Email failed:", emailError.message);
    }

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

      /* =========================
         📧 SEND CONFIRMATION EMAIL
      ========================= */
      try {

        await sendEmail(
          order.shippingInfo.email,
          "Order Confirmed - Wearity",

          `Hello ${order.shippingInfo.name},

Your order (${order._id}) has been confirmed 🎉

Thank you for shopping with Wearity.
`
        );

      } catch (emailError) {
        console.log("Email failed:", emailError.message);
      }
    }

    const updated = await order.save();

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  createOrder,
  updateOrderStatus,
};
