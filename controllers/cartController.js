const Cart = require("../models/Cart");

// ADD / UPDATE CART
exports.addToCart = async (req, res) => {
  const { guestId } = req.params;
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ guestId });

  if (!cart) {
    cart = new Cart({ guestId, items: [] });
  }

  const existingItem = cart.items.find(
    item => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  res.json(cart);
};

// GET CART
exports.getCart = async (req, res) => {
  const { guestId } = req.params;

  const cart = await Cart.findOne({ guestId })
    .populate("items.product");

  if (!cart) {
    return res.json({ items: [] });
  }

  res.json(cart);
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  const { guestId, productId } = req.params;

  const cart = await Cart.findOne({ guestId });

  if (!cart) return res.json({ items: [] });

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();

  res.json(cart);
};
