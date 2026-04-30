const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one cart per user
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

// Optional safety: prevent duplicate products in cart (recommended)
CartSchema.index({ user: 1, 'products.product': 1 }, { unique: true });

module.exports = mongoose.model('Cart', CartSchema);
