const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User model
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // Reference to the Product model
        quantity: { type: Number, required: true },  // Quantity of the product in the cart
      },
    ],
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model('Cart', CartSchema);  // Export Cart model
