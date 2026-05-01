const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      min: 0,
    },

    onSale: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    isOutOfStock: {
      type: Boolean,
      default: false,
    },

    materials: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    carats: {
      type: [String],
      default: [],
    },

    deliveryInfo: {
      deliveryTime: { type: String, default: '' },
      returnPolicy: { type: String, default: '' },
      certification: { type: String, default: '' },
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// ✅ AUTO HANDLE STOCK STATUS
ProductSchema.pre('save', function (next) {
  this.isOutOfStock = this.stock <= 0;
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
