const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // ✅ one cart per user (important for ecommerce)
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
          min: 1, // ✅ prevents 0 or negative quantity
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);
