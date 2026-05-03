const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
      },
    ],

    shippingInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "SadaPay", "NayaPay"],
      default: "COD",
    },

    totalPrice: Number,

    // 🔥 NEW
    isPaid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
