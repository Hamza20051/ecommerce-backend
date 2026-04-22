const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],

  shippingInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },

  paymentMethod: { type: String, required: true },

  discountCode: { type: String },
  totalPrice: { type: Number, required: true },

  // 🟡 PAYMENT TRACKING
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },

  // 🟡 DELIVERY TRACKING
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },

  // ⭐ NEW: ORDER STATUS SYSTEM
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Confirmed", "Delivered"]
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
